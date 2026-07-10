import { getCustomPage } from '@/lib/db';
import { notFound } from 'next/navigation';
import SafeScriptExecution from '@/components/SafeScriptExecution';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let page = null;
  try {
    page = await getCustomPage(slug);
  } catch (err) {}

  if (!page) return { title: 'Not Found' };

  const metadata = {
    title: page.title || 'Custom Page',
    description: page.meta_description || 'Custom legal page on Find My Vakeel',
  };

  if (page.keywords) {
    metadata.keywords = page.keywords;
  }

  if (page.canonical_url) {
    metadata.alternates = { canonical: page.canonical_url };
  } else {
    metadata.alternates = { canonical: `/${slug}` };
  }

  return metadata;
}

export default async function CustomPage({ params }) {
  const { slug } = await params;
  let page = null;
  
  try {
    page = await getCustomPage(slug);
  } catch (err) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <h1 className="text-2xl font-bold text-slate-300">Database Connection Required</h1>
      </div>
    );
  }

  if (!page) {
    notFound();
  }

  let rawHtml = page.html_content || '';
  
  // 1. Extract Styles
  const styleRegex = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
  let styleMatch;
  let extractedStyles = [];
  styleRegex.lastIndex = 0;
  while ((styleMatch = styleRegex.exec(rawHtml)) !== null) {
    if (styleMatch[1].trim()) {
      extractedStyles.push(styleMatch[1]);
    }
  }
  let htmlWithoutStyles = rawHtml.replace(styleRegex, '');

  // 2. Extract Scripts (JS only, handling src)
  const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let scriptMatch;
  let scriptsToExecute = [];
  
  // Add legacy JS content if it exists
  if (page.js_content) {
    scriptsToExecute.push({ type: 'inline', content: page.js_content });
  }

  scriptRegex.lastIndex = 0;
  while ((scriptMatch = scriptRegex.exec(htmlWithoutStyles)) !== null) {
    const attrs = scriptMatch[1] || '';
    const content = scriptMatch[2] || '';
    
    // Ignore JSON-LD and other non-JS scripts
    if (attrs.includes('application/ld+json')) continue;
    if (attrs.includes('type') && !attrs.includes('text/javascript') && !attrs.includes('module')) {
      // If it has a type that isn't JS/module, it might be something else we should ignore for execution
      if (!attrs.includes('type=""')) continue; 
    }

    const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
    if (srcMatch) {
      scriptsToExecute.push({ type: 'external', src: srcMatch[1] });
    } else if (content.trim()) {
      scriptsToExecute.push({ type: 'inline', content: content });
    }
  }

  scriptRegex.lastIndex = 0;
  let finalHtml = htmlWithoutStyles.replace(scriptRegex, '');
  
  // 3. Clean up DOCTYPE, html, head, and body tags to prevent hydration mismatch
  finalHtml = finalHtml
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .replace(/<html\b[^>]*>/gi, '')
    .replace(/<\/html>/gi, '')
    .replace(/<head\b[^>]*>([\s\S]*?)<\/head>/gi, '') // Usually we don't want head content inside body div
    .replace(/<body\b[^>]*>/gi, '')
    .replace(/<\/body>/gi, '');

  // 4. Remove dynamic headings for advocate listings (e.g. Top 20 Lawyers in {City})
  finalHtml = finalHtml.replace(/<h([1-6])[^>]*>[\s\S]*?Top\s+\d*\s*(?:Lawyers|Advocates)\s+in[\s\S]*?<\/h\1>/gi, '');
  finalHtml = finalHtml.replace(/<p[^>]*>[\s\S]*?Click Call or Chat to connect with any advocate directly\.?[\s\S]*?<\/p>/gi, '');

  return (
    <>
      {page.schema_markup && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: page.schema_markup }}
        />
      )}
      
      {/* Inject Extracted Styles */}
      {extractedStyles.map((style, i) => (
        <style key={`extracted-style-${i}`} dangerouslySetInnerHTML={{ __html: style }} />
      ))}
      
      {/* Inject Legacy Style */}
      {page.css_content && (
        <style dangerouslySetInnerHTML={{ __html: page.css_content }} />
      )}

      <main className="pt-32 pb-20 min-h-screen">
        {/* Render Clean HTML content */}
        <div 
          className="custom-page-container w-full"
          dangerouslySetInnerHTML={{ __html: finalHtml }} 
        />

        {/* Execute JavaScript safely on the client side */}
        {scriptsToExecute.length > 0 && (
          <SafeScriptExecution scripts={scriptsToExecute} />
        )}
      </main>
    </>
  );
}
