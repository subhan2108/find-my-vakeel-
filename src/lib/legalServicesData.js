export const categories = [
  { id: 'all', label: 'All Services', icon: 'fa-th-large' },
  { id: 'family', label: 'Family Law', icon: 'fa-users' },
  { id: 'criminal', label: 'Criminal Law', icon: 'fa-gavel' },
  { id: 'property', label: 'Property Law', icon: 'fa-building' },
  { id: 'civil', label: 'Civil Matters', icon: 'fa-balance-scale' },
  { id: 'corporate', label: 'Corporate Law', icon: 'fa-briefcase' },
  { id: 'banking', label: 'Banking', icon: 'fa-university' },
  { id: 'consumer', label: 'Consumer', icon: 'fa-shopping-cart' },
  { id: 'labour', label: 'Labour', icon: 'fa-hard-hat' },
  { id: 'tax', label: 'Tax', icon: 'fa-file-invoice-dollar' },
  { id: 'ip', label: 'IP Rights', icon: 'fa-trademark' },
  { id: 'docs', label: 'Documentation', icon: 'fa-file-alt' },
  { id: 'cyber', label: 'Cyber Law', icon: 'fa-laptop' },
  { id: 'court', label: 'Court Services', icon: 'fa-landmark' }
];

export const servicesData = [
  // Family Law
  {
    id: 'divorce',
    categoryId: 'family',
    title: 'Divorce',
    link: '/legal-services/divorce',
    description: 'Expert legal representation for contested and mutual divorce proceedings across India.',
    icon: 'fa-divorce'
  },
  {
    id: 'mutual-divorce',
    categoryId: 'family',
    title: 'Mutual Divorce',
    link: '/legal-services/mutual-divorce',
    description: 'Quick and amicable mutual consent divorce with minimal court appearances required.',
    icon: 'fa-handshake'
  },
  {
    id: 'child-custody',
    categoryId: 'family',
    title: 'Child Custody',
    link: '/legal-services/child-custody',
    description: 'Protect your parental rights with expert child custody and visitation legal assistance.',
    icon: 'fa-child'
  },
  {
    id: 'maintenance',
    categoryId: 'family',
    title: 'Maintenance',
    link: '/legal-services/maintenance',
    description: 'Secure fair maintenance claims for wives, children, and parents under Indian law.',
    icon: 'fa-coins'
  },
  {
    id: 'domestic-violence',
    categoryId: 'family',
    title: 'Domestic Violence',
    link: '/legal-services/domestic-violence',
    description: 'Legal protection and immediate relief against domestic violence under Protection of Women Act.',
    icon: 'fa-shield-alt'
  },
  {
    id: 'adoption',
    categoryId: 'family',
    title: 'Adoption',
    link: '/legal-services/adoption',
    description: 'Complete legal guidance for domestic and inter-country adoption procedures in India.',
    icon: 'fa-baby'
  },
  {
    id: 'guardianship',
    categoryId: 'family',
    title: 'Guardianship',
    link: '/legal-services/guardianship',
    description: 'Establish legal guardianship for minors and incapacitated persons under Indian law.',
    icon: 'fa-user-shield'
  },
  {
    id: 'restitution-conjugal-rights',
    categoryId: 'family',
    title: 'Restitution of Conjugal Rights',
    link: '/legal-services/restitution-conjugal-rights',
    description: 'Legal remedy for restoring marital relationship when one spouse withdraws without reason.',
    icon: 'fa-heart'
  },
  {
    id: 'alimony',
    categoryId: 'family',
    title: 'Alimony',
    link: '/legal-services/alimony',
    description: 'Claim fair permanent alimony and financial support post-divorce from your spouse.',
    icon: 'fa-rupee-sign'
  },
  {
    id: 'marriage-registration',
    categoryId: 'family',
    title: 'Marriage Registration',
    link: '/legal-services/marriage-registration',
    description: 'Hassle-free marriage registration services under Hindu Marriage Act or Special Marriage Act.',
    icon: 'fa-certificate'
  },
  {
    id: 'hindu-marriage',
    categoryId: 'family',
    title: 'Hindu Marriage Matters',
    link: '/legal-services/hindu-marriage',
    description: 'Comprehensive legal support for Hindu marriage, divorce, and matrimonial property disputes.',
    icon: 'fa-om'
  },
  {
    id: 'muslim-family-disputes',
    categoryId: 'family',
    title: 'Muslim Family Disputes',
    link: '/legal-services/muslim-family-disputes',
    description: 'Expert guidance on Muslim personal law matters including nikah, talaq, and mehr disputes.',
    icon: 'fa-mosque'
  },
  {
    id: 'family-settlement',
    categoryId: 'family',
    title: 'Family Settlement',
    link: '/legal-services/family-settlement',
    description: 'Draft and execute family settlement deeds to amicably resolve property disputes among heirs.',
    icon: 'fa-file-contract'
  },

  // Criminal Law
  {
    id: 'bail',
    categoryId: 'criminal',
    title: 'Bail',
    link: '/legal-services/bail',
    description: 'Secure immediate bail with expert criminal lawyers representing you in court urgently.',
    icon: 'fa-unlock'
  },
  {
    id: 'anticipatory-bail',
    categoryId: 'criminal',
    title: 'Anticipatory Bail',
    link: '/legal-services/anticipatory-bail',
    description: 'Pre-arrest protection bail filed before arrest to safeguard your liberty and rights.',
    icon: 'fa-clock'
  },
  {
    id: 'fir-matters',
    categoryId: 'criminal',
    title: 'FIR Matters',
    link: '/legal-services/fir-matters',
    description: 'File or quash FIR with legal expertise in criminal procedure and investigation matters.',
    icon: 'fa-file-signature'
  },
  {
    id: 'criminal-trial',
    categoryId: 'criminal',
    title: 'Criminal Trial',
    link: '/legal-services/criminal-trial',
    description: 'Strong courtroom representation throughout criminal trial from chargesheet to verdict.',
    icon: 'fa-balance-scale-right'
  },
  {
    id: 'cyber-crime',
    categoryId: 'criminal',
    title: 'Cyber Crime',
    link: '/legal-services/cyber-crime',
    description: 'Legal defense against cyber crime charges including hacking, phishing, and online fraud.',
    icon: 'fa-laptop-code'
  },
  {
    id: 'fraud-cases',
    categoryId: 'criminal',
    title: 'Fraud Cases',
    link: '/legal-services/fraud-cases',
    description: 'Expert legal defense in financial fraud, identity theft, and fraudulent transaction cases.',
    icon: 'fa-user-secret'
  },
  {
    id: 'cheating-cases',
    categoryId: 'criminal',
    title: 'Cheating Cases',
    link: '/legal-services/cheating-cases',
    description: 'Strong defense against Section 420 cheating allegations and criminal breach of trust.',
    icon: 'fa-mask'
  },
  {
    id: 'ipc-matters',
    categoryId: 'criminal',
    title: 'IPC Matters',
    link: '/legal-services/ipc-matters',
    description: 'Complete legal support for all Indian Penal Code offenses from investigation to trial.',
    icon: 'fa-book-open'
  },
  {
    id: 'ndps-cases',
    categoryId: 'criminal',
    title: 'NDPS Cases',
    link: '/legal-services/ndps-cases',
    description: 'Specialized defense in Narcotic Drugs and Psychotropic Substances Act violations.',
    icon: 'fa-pills'
  },
  {
    id: 'assault-cases',
    categoryId: 'criminal',
    title: 'Assault Cases',
    link: '/legal-services/assault-cases',
    description: 'Legal representation for assault, hurt, and criminal intimidation charges under IPC.',
    icon: 'fa-fist-raised'
  },
  {
    id: 'murder-cases',
    categoryId: 'criminal',
    title: 'Murder Cases',
    link: '/legal-services/murder-cases',
    description: 'Experienced criminal defense lawyers for murder, culpable homicide, and dowry death cases.',
    icon: 'fa-skull'
  },
  {
    id: 'theft-cases',
    categoryId: 'criminal',
    title: 'Theft Cases',
    link: '/legal-services/theft-cases',
    description: 'Defense against theft, robbery, dacoity, and criminal misappropriation charges.',
    icon: 'fa-theft'
  },
  {
    id: 'white-collar-crime',
    categoryId: 'criminal',
    title: 'White Collar Crime',
    link: '/legal-services/white-collar-crime',
    description: 'Defense in embezzlement, money laundering, and corporate fraud white collar criminal cases.',
    icon: 'fa-briefcase'
  },
  {
    id: 'police-complaints',
    categoryId: 'criminal',
    title: 'Police Complaints',
    link: '/legal-services/police-complaints',
    description: 'Draft and file criminal complaints, and seek legal remedies against police inaction.',
    icon: 'fa-exclamation-triangle'
  },

  // Property Law
  {
    id: 'property-disputes',
    categoryId: 'property',
    title: 'Property Disputes',
    link: '/legal-services/property-disputes',
    description: 'Resolve ownership, boundary, and title disputes with expert property litigation lawyers.',
    icon: 'fa-exchange-alt'
  },
  {
    id: 'land-disputes',
    categoryId: 'property',
    title: 'Land Disputes',
    link: '/legal-services/land-disputes',
    description: 'Comprehensive legal support for agricultural and residential land ownership conflicts.',
    icon: 'fa-map-marked-alt'
  },
  {
    id: 'sale-deed',
    categoryId: 'property',
    title: 'Sale Deed',
    link: '/legal-services/sale-deed',
    description: 'Draft, verify, and register sale deeds for secure property transactions across India.',
    icon: 'fa-file-alt'
  },
  {
    id: 'gift-deed',
    categoryId: 'property',
    title: 'Gift Deed',
    link: '/legal-services/gift-deed',
    description: 'Legal drafting and registration of gift deeds for property transfer between family members.',
    icon: 'fa-gift'
  },
  {
    id: 'property-registration',
    categoryId: 'property',
    title: 'Property Registration',
    link: '/legal-services/property-registration',
    description: 'Complete guidance on property registration, stamp duty, and documentation procedures.',
    icon: 'fa-stamp'
  },
  {
    id: 'partition-suit',
    categoryId: 'property',
    title: 'Partition Suit',
    link: '/legal-services/partition-suit',
    description: 'File partition suits to legally divide joint family property among co-owners fairly.',
    icon: 'fa-cut'
  },
  {
    id: 'builder-disputes',
    categoryId: 'property',
    title: 'Builder Disputes',
    link: '/legal-services/builder-disputes',
    description: 'Legal action against builders for project delays, possession issues, and fraud.',
    icon: 'fa-hard-hat'
  },
  {
    id: 'encroachment',
    categoryId: 'property',
    title: 'Encroachment Matters',
    link: '/legal-services/encroachment',
    description: 'Remove illegal encroachments on your property through court injunctions and legal notices.',
    icon: 'fa-border-all'
  },
  {
    id: 'mutation',
    categoryId: 'property',
    title: 'Mutation',
    link: '/legal-services/mutation',
    description: 'Property name transfer in municipal records after purchase, inheritance, or gift.',
    icon: 'fa-edit'
  },
  {
    id: 'property-verification',
    categoryId: 'property',
    title: 'Property Verification',
    link: '/legal-services/property-verification',
    description: 'Thorough title search and legal verification before purchasing any residential or commercial property.',
    icon: 'fa-search'
  },
  {
    id: 'agricultural-land',
    categoryId: 'property',
    title: 'Agricultural Land Cases',
    link: '/legal-services/agricultural-land',
    description: 'Legal support for agricultural land purchase, lease, tenancy, and conversion disputes.',
    icon: 'fa-tractor'
  },
  {
    id: 'rera',
    categoryId: 'property',
    title: 'RERA Matters',
    link: '/legal-services/rera',
    description: 'File complaints under RERA for builder delays, false promises, and project violations.',
    icon: 'fa-home'
  },

  // Civil Matters
  {
    id: 'recovery-suit',
    categoryId: 'civil',
    title: 'Recovery Suit',
    link: '/legal-services/recovery-suit',
    description: 'Recover outstanding debts, loans, and dues through civil court recovery proceedings.',
    icon: 'fa-money-bill-wave'
  },
  {
    id: 'injunction',
    categoryId: 'civil',
    title: 'Injunction',
    link: '/legal-services/injunction',
    description: 'Obtain temporary or permanent injunctions to restrain illegal actions against your rights.',
    icon: 'fa-stop-circle'
  },
  {
    id: 'declaration-suit',
    categoryId: 'civil',
    title: 'Declaration Suit',
    link: '/legal-services/declaration-suit',
    description: 'File declaration suits to establish legal rights, title, and status of property or status.',
    icon: 'fa-scroll'
  },
  {
    id: 'damages-claim',
    categoryId: 'civil',
    title: 'Damages Claim',
    link: '/legal-services/damages-claim',
    description: 'Claim compensation for financial losses, defamation, breach of duty, and civil wrongs.',
    icon: 'fa-hand-holding-usd'
  }
];

export const categoryDetails = {
  family: {
    title: 'Family Law Services',
    description: 'Matrimonial disputes, custody, divorce & family settlements',
    icon: 'fa-users',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    cardBgFrom: 'from-blue-50',
    cardBgTo: 'to-blue-100'
  },
  criminal: {
    title: 'Criminal Law Services',
    description: 'Bail, FIR, criminal defense, cyber crime & white collar cases',
    icon: 'fa-gavel',
    bgColor: 'bg-red-100',
    iconColor: 'text-red-600',
    cardBgFrom: 'from-red-50',
    cardBgTo: 'to-red-100'
  },
  property: {
    title: 'Property Law Services',
    description: 'Property disputes, land cases, registration, builder disputes & RERA',
    icon: 'fa-building',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    cardBgFrom: 'from-green-50',
    cardBgTo: 'to-green-100'
  },
  civil: {
    title: 'Civil Matters',
    description: 'Recovery suits, injunctions, contracts, appeals & consumer disputes',
    icon: 'fa-balance-scale',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
    cardBgFrom: 'from-purple-50',
    cardBgTo: 'to-purple-100'
  }
};
