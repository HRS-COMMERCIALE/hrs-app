const ar = {
  homePage: {
    navbar: {
      home: "الرئيسية",
      features: "الميزات",
      about: "من نحن",
      contactUs: "اتصل بنا",
      getStarted: "ابدأ الآن",
      dashboard: "لوحة التحكم",
      login: "تسجيل الدخول",
      signUp: "إنشاء حساب"
    },
    heroSection:{
      statusBadge: {
        text: "🚀 نمو سريع مع الشركات في جميع أنحاء العالم"
      },
      hero: {
        title: {
          line1: "حوّل",
          line2: "عمليات عملك"
        },
        description: {
          main: "المنصة الوحيدة لإدارة الأعمال التي ستحتاجها على الإطلاق.",
          highlight: " بسط الفواتير والموردين والعملاء والتحليلات",
          ending: " مع حلولنا الذكية الشاملة."
        }
      },
      cta: {
        primaryButton: {
          text: "ابدأ التجربة المجانية"
        },
        secondaryButton: {
          text: "شاهد العرض التوضيحي"
        }
      },
      trustIndicators: {
        setup: "إعداد في 5 دقائق",
        cancel: "إلغاء في أي وقت",
        security: "أمان على مستوى البنوك"
      }
    },
    BusinessSolutions:{
      badge: "الحلول الأساسية للأعمال",
      title1: "توقف عن خسارة الأموال",
      title2: "! ابدأ في النمو",
      description: "معظم الشركات تهدر 20% من إيراداتها بسبب عدم الكفاءة. منصتنا تقضي على الهدر، وتؤتمت المهام المملة، وتعطيك الرؤى لتحقيق المزيد من الأرباح.",
      descriptionHighlight: "ابدأ في رؤية النتائج خلال 30 يوماً.",
      salesTitle: "المبيعات والفواتير",
      salesSubtitle: "احصل على المال أسرع",
      salesDescription: "أنشئ فواتير احترافية في ثوانٍ. تتبع المدفوعات تلقائياً. لا تطارد المال مرة أخرى.",
      salesFeatures: ["فواتير في 30 ثانية", "تذكيرات الدفع التلقائية", "تتبع المدفوعات في الوقت الفعلي", "قوالب احترافية", "دعم العملات المتعددة"],
      inventoryTitle: "التحكم في المخزون",
      inventorySubtitle: "توقف عن خسارة الأموال",
      inventoryDescription: "اعرف بالضبط ما لديك، وأين هو، ومتى تعيد الطلب. قضِ على نفاد المخزون والإفراط في التخزين.",
      inventoryFeatures: ["مستويات المخزون في الوقت الفعلي", "تنبيهات إعادة الطلب التلقائية", "تتبع المستودعات المتعددة", "مسح الباركود", "تقارير قيمة المخزون"],
      financialTitle: "لوحة المعلومات المالية",
      financialSubtitle: "راقب أموالك",
      financialDescription: "اعرف تدفقك النقدي فوراً. اتخذ قرارات بناءً على أرقام حقيقية، وليس تخمينات.",
      financialFeatures: ["عرض التدفق النقدي المباشر", "تتبع الأرباح والخسائر", "تصنيف المصروفات", "تقارير جاهزة للضرائب", "المصالحة المصرفية"],
      customerTitle: "إدارة العملاء",
      customerSubtitle: "نمِ عملك",
      customerDescription: "حافظ على سعادة العملاء وعودتهم. تتبع كل تفاعل ولا تفوت فرصة أبداً.",
      customerFeatures: ["قاعدة بيانات العملاء", "تتبع تاريخ المبيعات", "تذكيرات المتابعة", "رؤى العملاء", "الوصول للـ CRM عبر الهاتف"],
      featuresTitle: "الميزات الرئيسية",
      learnMore: "اعرف المزيد",
      ctaTitle: "مستعد للتوقف عن خسارة الأموال؟",
      ctaDescription: "انضم إلى أكثر من 10,000 شركة زادت أرباحها بمتوسط 35% في السنة الأولى.",
      startFreeTrial: "ابدأ التجربة المجانية",
      watchDemo: "شاهد العرض التوضيحي"
    },
    BusinessPlan:{
      header: {
        badge: {
          icon: "💎",
          text: "اختر مسارك"
        },
        title: "اختر خطة عملك",
        subtitle: "حلول مصممة لجميع أنواع الأعمال، من الشركات الناشئة إلى المؤسسات الكبيرة"
      },
      pricingTiers: [
        {
          name: 'بريميوم',
          price: '59.99',
          currency: 'HT',
          features: [
            'حساب شركة واحد',
            '5 حسابات مستخدمين',
            'مندوب مبيعات متنقل واحد (مجاناً)',
            'وحدات المبيعات والمشتريات',
            'المالية والموارد البشرية (قياسي)',
            'منتجات ومخزون غير محدود',
            'إدارة العملاء والموردين',
            'تسعير خاص بالعملاء',
          ],
          buttonText: 'اشترك'
        },
        {
          name: 'بلاتينيوم',
          price: '129.00',
          currency: 'HT',
          features: [
            'حساب شركة واحد',
            '5 حسابات مستخدمين',
            'مندوب مبيعات متنقل واحد (مجاناً)',
            'وحدات المبيعات والمشتريات',
            'المالية والموارد البشرية (قياسي)',
            'إدارة الإجازات والمصروفات',
            'إدارة علاقات العملاء المتنقلة (غير متصل ومتصل)',
            'تخطيط الاجتماعات والتقارير',
            'لوحة معلومات الإيرادات والاستطلاعات',
            'إدارة التحصيل وإدارة المكالمات',
          ],
          buttonText: 'اشترك',
          popular: true
        },
        {
          name: 'دايموند',
          price: '270.00',
          currency: 'HT',
          features: [
            '3 حسابات شركات',
            '15 حساب مستخدم',
            '5 مندوبي مبيعات متنقلين (مجاناً)',
            'دورات المبيعات وإدارة المشاريع',
            'الموارد البشرية المتقدمة وإدارة الأسطول',
            'تخطيط الفواتير الدورية',
            'إدارة علاقات العملاء المتنقلة (غير متصل ومتصل)',
            'تخطيط الاجتماعات والتقارير',
            'لوحة معلومات الإيرادات والاستطلاعات',
            'إدارة التحصيل وإدارة المكالمات',
          ],
          buttonText: 'اشترك'
        }
      ],
      customPlan: {
        name: 'خطة مخصصة',
        price: 'مصممة خصيصاً',
        description: 'حل مخصص لاحتياجاتك الخاصة',
        features: [
          'جميع الوحدات متاحة',
          'مستخدمين غير محدودين',
          'دعم مخصص على مدار الساعة',
          'تدريب وتكاملات مخصصة'
        ],
        buttonText: 'اتصل بنا'
      },
      footer: {
        maintenance: 'جميع خططنا تشمل الصيانة والتحديثات والدعم الفني',
        pricing: '* أسعار HT - الفواتير الشهرية أو السنوية متاحة',
        innovation: 'مستعد للابتكار؟'
      }
    },
    footer:{
      company: {
        name: "Tunisie Business",
        tagline: "Solutions",
        description: "تمكين الشركات التونسية من خلال حلول برمجية مبتكرة للنمو والنجاح في العصر الرقمي.",
        logoAlt: "شعار حلول تونس بيزنس"
      },
      quickMenu: {
        title: "القائمة السريعة",
        items: [
          { label: "الرئيسية", href: "#home", icon: "home" },
          { label: "الميزات", href: "#features", icon: "features" },
          { label: "من نحن", href: "#about", icon: "about" },
          { label: "اتصل بنا", href: "#contact", icon: "contact" },
          { label: "الخطط التسعيرية", href: "#pricing", icon: "pricing" }
        ]
      },
      contactInfo: {
        title: "معلومات الاتصال",
        email: {
          label: "البريد الإلكتروني",
          value: "contact@tunisiebusiness.tn"
        },
        phone: {
          label: "أرقام الهاتف",
          numbers: [
            "+216 71 234 567",
            "+216 98 765 432"
          ]
        },
        address: {
          label: "العنوان",
          lines: [
            "123 شارع الحبيب بورقيبة",
            "تونس 1000، تونس"
          ]
        }
      },
      location: {
        title: "موقعنا",
        city: "تونس، تونس",
        subtitle: "العاصمة",
        mapPlaceholder: "خريطة تفاعلية قريباً"
      },
      footer: {
        links: [
          "سياسة الخصوصية",
          "شروط الخدمة",
          "سياسة ملفات تعريف الارتباط"
        ]
      }
    }
  },
  auth:{
    login:{
      welcomeBack: "مرحباً بعودتك",
      subtitle: "سجّل الدخول لمتابعة رحلتك معنا",
      emailLabel: "عنوان البريد الإلكتروني",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      passwordLabel: "كلمة المرور",
      passwordPlaceholder: "أدخل كلمة المرور",
      rememberMe: "تذكرني",
      forgotPassword: "هل نسيت كلمة المرور؟",
      submit: {
        idle: "تسجيل الدخول",
        loading: "جارٍ تسجيل الدخول..."
      },
      noAccount: "ليس لديك حساب؟",
      createAccount: "أنشئ حسابك"
    },
    leftSide: {
      title: {
        line1: "حوّل",
        line2: "رحلة عملك"
      },
      subtitle: "افتح التحليلات القوية والتعاون السلس والأتمتة الذكية في منصة موحدة واحدة",
      features: [
        {
          title: "التحليلات في الوقت الفعلي",
          subtitle: "رؤى الأعمال المباشرة"
        },
        {
          title: "الأتمتة الذكية",
          subtitle: "سير العمل الذكي"
        },
        {
          title: "أمان المؤسسات",
          subtitle: "حماية عسكرية المستوى"
        }
      ],
      security: {
        soc2: "معتمد SOC 2",
        gdpr: "متوافق مع GDPR"
      }
    },
    register:{
      HRS_TERMS_AND_CONDITIONS_FR:`
Termes et Conditions d'utilisation
de la solution HRSCommerciale.exe

Ce Contrat d’Utilisation (« Contrat ») régit l’accès et l’utilisation de la solution HRSCommerciale.exe (ci-après le « Service ») fournie par [RAISON SOCIALE] (MF : [MATRICULE FISCAL]), sise [ADRESSE SIÈGE SOCIAL], [PAYS], et représentée par [NOM DU REPRÉSENTANT] (« Fournisseur »).

Date de dernière mise à jour : [JJ/MM/AAAA]

1. Acceptation des Conditions
En accédant ou en utilisant le Service, vous reconnaissez avoir lu, compris et accepté d’être lié par le présent Contrat. Si vous n’acceptez pas ces Conditions, n’utilisez pas le Service.

2. Définitions
« Client » : toute personne morale ou physique professionnelle utilisant le Service.
« Compte » : l’environnement attribué au Client pour accéder au Service.
« Données Client » : données importées, générées ou traitées via le Service pour le compte du Client.
« Modules » : fonctionnalités disponibles au sein du Service, gratuites ou payantes.
« Utilisateur Autorisé » : salarié, mandataire ou prestataire dûment habilité par le Client.

3. Description du Service
3.1 Nature du Service
HRSCommerciale.exe est une solution de gestion commerciale et ERP, disponible en mode SaaS (via [URL D’ACCÈS]) et/ou application de bureau, offrant des packs gratuits et payants avec des fonctionnalités et des limites spécifiques.
3.2 Public concerné
Le Service est réservé aux professionnels (entreprises privées, sociétés individuelles, indépendants et établissements publics), quel que soit le lieu de leur siège.
3.3 Environnement Client
Chaque Client dispose d’un environnement dédié et sécurisé, accessible par identifiants.

4. Inscription, Accès et Compte
4.1 Inscription
Le Client s’engage à fournir des informations exactes, complètes et à jour, et à les maintenir.
4.2 Sécurité du Compte
Le Client est responsable de la confidentialité des identifiants et de toutes activités menées depuis son Compte. Il s’engage à notifier sans délai toute utilisation non autorisée à [EMAIL SUPPORT].
4.3 Accès
Le Fournisseur peut suspendre temporairement l’accès pour maintenance planifiée ou urgence de sécurité. Le Fournisseur s’efforce de minimiser l’impact.

5. Utilisation Autorisée et Interdite
5.1 Respect des lois
Le Client s’engage à utiliser le Service conformément aux lois et réglementations applicables.
5.2 Usages interdits
Sont notamment interdits : (a) l’ingénierie inverse, le contournement de sécurité, le test intrusif non autorisé ; (b) l’utilisation pour des activités illicites, diffamatoires, frauduleuses, contrefaisantes, ou portant atteinte à des droits de tiers ; (c) l’envoi de spam, de malwares, ou toute charge démesurée sur l’infrastructure ; (d) le partage d’identifiants hors du périmètre d’Utilisateurs Autorisés.
5.3 Conformité export / sanctions
Le Client garantit que l’usage respecte les lois d’exportation et régimes de sanctions applicables.

6. Packs, Limitations et Évolution du Service
6.1 Packs
Le pack gratuit comporte des limites (ex. nombre d’utilisateurs, modules, stockage). Les packs payants offrent des capacités étendues selon la grille tarifaire en vigueur.
6.2 Modifications
Le Fournisseur peut modifier, ajouter ou retirer des Modules, sans diminuer substantiellement les fonctionnalités essentielles d’un pack en cours d’abonnement.
6.3 Version bêta / essais
Certains Modules peuvent être proposés en bêta ou à l’essai, sans garantie et susceptibles d’évolution rapide.

7. Propriété Intellectuelle
7.1 Titularité
Le Service, ses composants, marques, logos, documentations et codes restent la propriété exclusive du Fournisseur et/ou de ses concédants.
7.2 Licence d’utilisation
Sous réserve du respect du Contrat et du paiement des frais applicables, le Fournisseur accorde au Client une licence non exclusive, non transférable et limitée pour utiliser le Service, pour ses besoins internes.
7.3 Retours et suggestions
Toute suggestion d’amélioration fournie par le Client peut être librement utilisée par le Fournisseur, sans obligation ni contrepartie.

8. Données Client, Confidentialité et Sécurité
8.1 Données Client
Les Données Client demeurent la propriété du Client. Le Fournisseur agit en qualité de sous-traitant pour les besoins de fourniture du Service.
8.2 Collecte et traitement
Le Fournisseur collecte les données nécessaires à la création et gestion du Compte, à la facturation, au support et à l’amélioration du Service, conformément à sa Politique de Confidentialité disponible sur [URL POLITIQUE].
8.3 Partage
Les données peuvent être partagées avec des sous-traitants techniques (hébergement, emailing, paiement) soumis à obligations de confidentialité et de sécurité.
8.4 Sécurité
Le Fournisseur met en œuvre des mesures techniques et organisationnelles raisonnables (contrôle d’accès, chiffrement en transit au minimum TLS, sauvegardes périodiques) pour protéger les Données Client.
8.5 Notification d’incident
En cas de violation de données affectant le Client, le Fournisseur notifiera le Client sans retard injustifié, avec les informations disponibles.
8.6 Conservation et restitution
À la résiliation, le Client peut demander l’export de ses Données dans un format standard raisonnable dans un délai de [X] jours. Passé ce délai, les Données seront supprimées des systèmes actifs et, après la période de rétention des sauvegardes, des archives.
8.7 Conformité locale
Le traitement de données à caractère personnel s’effectue conformément au droit applicable, notamment au cadre tunisien (ex. Décret n° 2007-300 du 27 novembre 2007 et règles INPDP) et, le cas échéant, aux exigences extraterritoriales applicables.

9. Niveaux de Service et Support
9.1 Disponibilité
Le Fournisseur vise une disponibilité annuelle moyenne de [99,5 %] hors fenêtres de maintenance planifiée et cas de force majeure.
9.2 Support
Le support est disponible aux heures ouvrées [Jours/Heures et Fuseau], via [EMAIL SUPPORT] et/ou [PORTAIL SUPPORT]. Un support d’astreinte peut être proposé en option.
9.3 Temps de réponse cibles
Incidents critiques : accusé sous [2 h ouvrées] ; incidents majeurs : [8 h] ; demandes mineures : [2 jours ouvrés] (objectifs non garantis).
9.4 Formation et ressources
Guides, FAQ et tutoriels sont accessibles sur [URL AIDE]. Des formations peuvent être proposées en option.

10. Frais, Facturation et Taxes
10.1 Tarifs
Les tarifs et options sont précisés sur [URL TARIFS] et peuvent évoluer pour les prochains cycles. Les prix en cours ne changent pas pendant la durée d’un abonnement déjà payé.
10.2 Modalités de paiement
Facturation anticipée par période (mensuelle/annuelle). Paiement à réception, par [MOYENS ACCEPTÉS]. Les montants versés sont non remboursables, sauf disposition impérative contraire.
10.3 Taxes
Les prix s’entendent hors taxes. Le Client est responsable de toutes taxes applicables.
10.4 Retards de paiement
En cas d’impayé, le Fournisseur peut suspendre l’accès après notification écrite et appliquer des intérêts et/ou frais de recouvrement conformes à la loi.

11. Garanties et Responsabilités
11.1 Garantie limitée
Le Service est fourni « en l’état » et « selon disponibilité ». Le Fournisseur ne garantit pas l’absence totale d’erreurs, d’interruptions ou de vulnérabilités.
11.2 Exclusion de dommages indirects
Dans la mesure permise par la loi, le Fournisseur n’est pas responsable des pertes de profits, pertes de données, pertes d’exploitation, atteinte à l’image ou dommages indirects/spéciaux.
11.3 Limitation de responsabilité
La responsabilité totale cumulée du Fournisseur au titre du Contrat est limitée au montant total effectivement payé par le Client pour le Service au cours des douze (12) derniers mois précédant le fait générateur.
11.4 Sauvegardes et récupération
Le Fournisseur met en place des sauvegardes périodiques. Le Client demeure responsable de ses propres exports et de vérifier l’intégrité de ses données critiques.
11.5 Tiers et intégrations
Le Fournisseur n’est pas responsable des services tiers utilisés par le Client (connecteurs, modules externes, passerelles de paiement).

12. Résiliation et Suspension
12.1 Résiliation par le Client
Le Client peut résilier à tout moment via le Compte ; la résiliation prend effet à la fin de la période déjà payée. Aucun remboursement pro rata n’est dû, sauf disposition impérative contraire.
12.2 Résiliation par le Fournisseur
Le Fournisseur peut résilier de plein droit en cas de (i) violation substantielle non corrigée sous [15] jours après notification, (ii) fraude, (iii) risque de sécurité grave, (iv) non-paiement persistant.
12.3 Effets de la résiliation
L’accès est clôturé ; le Client peut demander l’export des Données selon 8.6.
12.4 Suspension
Le Fournisseur peut suspendre l’accès en cas d’usage illicite, d’incident de sécurité, d’impayé, ou sur demande d’une autorité compétente.

13. Confidentialité
Chaque partie s’engage à garder confidentielles les informations non publiques reçues de l’autre partie et à ne les utiliser que pour l’exécution du Contrat, pendant la durée du Contrat et [3] ans après sa fin.

14. Force Majeure
Aucune partie n’est responsable d’un manquement dû à un événement de force majeure (catastrophe naturelle, panne réseau majeure, guerre, actes gouvernementaux, etc.). Les obligations sont suspendues pendant la durée de l’événement.

15. Sous-traitance et Transferts
Le Fournisseur peut recourir à des sous-traitants pour l’hébergement, le support et le traitement, sous obligations contractuelles équivalentes. Le Fournisseur demeure responsable vis-à-vis du Client.

16. Cession
Aucune partie ne peut céder le Contrat sans consentement préalable, sauf cession du Fournisseur dans le cadre d’une réorganisation, fusion, acquisition ou vente d’actifs, sans réduction des garanties de sécurité et confidentialité.

17. Conformité et Audit
Le Client s’engage à utiliser le Service conformément au Contrat. Le Fournisseur peut, après préavis raisonnable, réaliser des vérifications d’usage (non intrusives) pour contrôler le respect des limites de licence.

18. Communications et Notifications
Les notifications officielles se font par écrit à [EMAIL LÉGAL] et à l’adresse du siège du Client indiquée au Compte. Les communications opérationnelles peuvent être faites au sein du Service ou par email.

19. Divisibilité, Renonciation et Intégralité
Si une clause est jugée invalide, les autres demeurent en vigueur. Le fait pour une partie de ne pas exercer un droit ne vaut pas renonciation. Le présent Contrat constitue l’intégralité de l’accord entre les parties et remplace tout accord antérieur relatif au Service.

20. Droit Applicable et Juridiction
Le présent Contrat est régi par le droit tunisien, notamment les règles relatives au traitement des données à caractère personnel (ex. Décret n° 2007-300 du 27 novembre 2007 et cadre INPDP). Tout litige sera soumis à la compétence exclusive des tribunaux de [VILLE/INPDP COMPÉTENTE], sous réserve des dispositions impératives applicables.

21. Modifications du Contrat
Le Fournisseur peut modifier le Contrat à tout moment. Les modifications prennent effet à la publication dans le Service ou notification au Client. L’usage continu du Service après modification vaut acceptation.

22. Dispositions Spécifiques (API / Intégrations)
22.1 Clés API
L’usage d’API nécessite des clés confidentielles ; le Client est responsable de leur protection.
22.2 Quotas et limites
Des quotas et limitations techniques peuvent s’appliquer et évoluer.
22.3 Données échangées
Le Client demeure responsable de la licéité et de l’exactitude des données transmises via API.

23. Politique de Rétention et Journalisation
Des journaux techniques et de sécurité peuvent être conservés pour la traçabilité et la conformité pendant une durée raisonnable et limitée au strict nécessaire.

24. Contact
Pour toute question : [RAISON SOCIALE] — [ADRESSE COMPLÈTE] — Email : [EMAIL SUPPORT] — Tél. : [NUMÉRO TÉLÉPHONE] — Site : [URL SITE].
`
    }
  }
 
};

  
  export default ar;
  