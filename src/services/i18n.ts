export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'sw';

export interface Translations {
  appName: string;
  tagline: string;
  tabs: {
    map: string;
    commute: string;
    chat: string;
    analytics: string;
    security: string;
    docs: string;
  };
  map: {
    searchPlaceholder: string;
    pinLocation: string;
    planRoute: string;
    saveRoute: string;
    savedPins: string;
    clearRoute: string;
    trafficHeatmap: string;
    clickToPinNotice: string;
  };
  commute: {
    title: string;
    subtitle: string;
    leaveBy: string;
    calendarEvents: string;
    alertRules: string;
    testPushAlert: string;
    addEvent: string;
  };
  chat: {
    title: string;
    subtitle: string;
    inputPlaceholder: string;
    send: string;
    groundingCitations: string;
  };
  admin: {
    title: string;
    subtitle: string;
    totalRoutes: string;
    totalPins: string;
    scheduledEvents: string;
    activityLog: string;
  };
  security: {
    title: string;
    biometricTitle: string;
    biometricDesc: string;
    gdprTitle: string;
    exportData: string;
    purgeData: string;
  };
  common: {
    offlineMode: string;
    onlineMode: string;
    lockScreen: string;
    highContrast: string;
    darkMode: string;
    lightMode: string;
  };
}

export const TRANSLATIONS: Record<LanguageCode, Translations> = {
  en: {
    appName: 'GeoPulse',
    tagline: 'Map Navigation & Commute Alerts',
    tabs: {
      map: 'Map & Route',
      commute: 'Commute & Calendar',
      chat: 'Search Assistant',
      analytics: 'Usage & Activity',
      security: 'Privacy & Security',
      docs: 'Specifications',
    },
    map: {
      searchPlaceholder: 'Search address or location...',
      pinLocation: 'Pin Location',
      planRoute: 'Route Directions',
      saveRoute: 'Save Route',
      savedPins: 'Saved Locations',
      clearRoute: 'Clear Route',
      trafficHeatmap: 'Traffic Flow Overlay',
      clickToPinNotice: 'Click on the map to add a custom location',
    },
    commute: {
      title: 'Commute & Departure Alerts',
      subtitle: 'Dynamic departure calculations based on your scheduled appointments',
      leaveBy: 'Departure Time',
      calendarEvents: 'Scheduled Appointments',
      alertRules: 'Alert Rules',
      testPushAlert: 'Send Test Alert',
      addEvent: 'Add Appointment',
    },
    chat: {
      title: 'Location Search Assistant',
      subtitle: 'Real-time place and route search powered by Google Search Grounding',
      inputPlaceholder: 'Ask about locations, travel directions, or places...',
      send: 'Search',
      groundingCitations: 'Sources',
    },
    admin: {
      title: 'Activity & Usage Metrics',
      subtitle: 'Real-time overview of your local routes, pins, and recent alerts',
      totalRoutes: 'Saved Routes',
      totalPins: 'Saved Locations',
      scheduledEvents: 'Upcoming Appointments',
      activityLog: 'Recent Activity Log',
    },
    security: {
      title: 'Privacy & Security Settings',
      biometricTitle: 'Biometric Screen Lock',
      biometricDesc: 'Require fingerprint or facial verification before displaying calendar events.',
      gdprTitle: 'Data Management & Privacy',
      exportData: 'Export Stored Data (JSON)',
      purgeData: 'Erase All Local Data',
    },
    common: {
      offlineMode: 'Offline Mode',
      onlineMode: 'Connected',
      lockScreen: 'Lock',
      highContrast: 'High Contrast',
      darkMode: 'Dark Theme',
      lightMode: 'Light Theme',
    },
  },
  es: {
    appName: 'GeoPulse',
    tagline: 'Navegación y Alertas de Trayecto',
    tabs: {
      map: 'Mapa y Rutas',
      commute: 'Trayecto y Calendario',
      chat: 'Asistente de Búsqueda',
      analytics: 'Uso y Actividad',
      security: 'Privacidad y Seguridad',
      docs: 'Especificaciones',
    },
    map: {
      searchPlaceholder: 'Buscar dirección o lugar...',
      pinLocation: 'Fijar Ubicación',
      planRoute: 'Indicaciones de Ruta',
      saveRoute: 'Guardar Ruta',
      savedPins: 'Lugares Guardados',
      clearRoute: 'Limpiar Ruta',
      trafficHeatmap: 'Capa de Tráfico',
      clickToPinNotice: 'Haga clic en el mapa para añadir una ubicación',
    },
    commute: {
      title: 'Alertas de Trayecto y Salida',
      subtitle: 'Cálculos de salida según sus citas programadas',
      leaveBy: 'Hora de Salida',
      calendarEvents: 'Citas Programadas',
      alertRules: 'Reglas de Alertas',
      testPushAlert: 'Enviar Alerta de Prueba',
      addEvent: 'Añadir Cita',
    },
    chat: {
      title: 'Asistente de Búsqueda',
      subtitle: 'Búsqueda de lugares y rutas con Google Search Grounding',
      inputPlaceholder: 'Pregunte sobre lugares o direcciones...',
      send: 'Buscar',
      groundingCitations: 'Fuentes',
    },
    admin: {
      title: 'Métricas de Uso y Actividad',
      subtitle: 'Resumen real de sus rutas, lugares y alertas recientes',
      totalRoutes: 'Rutas Guardadas',
      totalPins: 'Lugares Guardados',
      scheduledEvents: 'Citas Próximas',
      activityLog: 'Registro de Actividad',
    },
    security: {
      title: 'Privacidad y Seguridad',
      biometricTitle: 'Bloqueo Biométrico',
      biometricDesc: 'Requerir huella o reconocimiento facial para acceder.',
      gdprTitle: 'Gestión de Datos y Privacidad',
      exportData: 'Exportar Datos (JSON)',
      purgeData: 'Borrar Datos Locales',
    },
    common: {
      offlineMode: 'Sin Conexión',
      onlineMode: 'En Línea',
      lockScreen: 'Bloquear',
      highContrast: 'Alto Contraste',
      darkMode: 'Tema Oscuro',
      lightMode: 'Tema Claro',
    },
  },
  fr: {
    appName: 'GeoPulse',
    tagline: 'Navigation et Alertes de Départ',
    tabs: {
      map: 'Carte & Trajets',
      commute: 'Trajets & Agenda',
      chat: 'Assistant de Recherche',
      analytics: 'Activité & Utilisation',
      security: 'Confidentialité',
      docs: 'Spécifications',
    },
    map: {
      searchPlaceholder: 'Rechercher une adresse...',
      pinLocation: 'Épingler ce lieu',
      planRoute: 'Calculer l’itinéraire',
      saveRoute: 'Enregistrer l’itinéraire',
      savedPins: 'Lieux enregistrés',
      clearRoute: 'Effacer l’itinéraire',
      trafficHeatmap: 'Trafic en temps réel',
      clickToPinNotice: 'Cliquez sur la carte pour ajouter un lieu',
    },
    commute: {
      title: 'Alertes de Départ et Agenda',
      subtitle: 'Calculs de départ synchronisés avec vos rendez-vous',
      leaveBy: 'Heure de Départ',
      calendarEvents: 'Rendez-vous prévus',
      alertRules: 'Règles d’alertes',
      testPushAlert: 'Tester l’alerte',
      addEvent: 'Ajouter un rendez-vous',
    },
    chat: {
      title: 'Assistant de Recherche',
      subtitle: 'Recherche de lieux et itinéraires avec Google Search Grounding',
      inputPlaceholder: 'Posez une question sur un lieu...',
      send: 'Rechercher',
      groundingCitations: 'Sources',
    },
    admin: {
      title: 'Activité et Métriques Réelles',
      subtitle: 'Aperçu de vos itinéraires, repères et alertes récents',
      totalRoutes: 'Itinéraires enregistrés',
      totalPins: 'Lieux enregistrés',
      scheduledEvents: 'Rendez-vous à venir',
      activityLog: 'Journal d’activité',
    },
    security: {
      title: 'Sécurité et Confidentialité',
      biometricTitle: 'Verrouillage biométrique',
      biometricDesc: 'Authentification requise pour déverrouiller l’agenda.',
      gdprTitle: 'Gestion des données personnelles',
      exportData: 'Exporter mes données (JSON)',
      purgeData: 'Effacer mes données',
    },
    common: {
      offlineMode: 'Hors-ligne',
      onlineMode: 'Connecté',
      lockScreen: 'Verrouiller',
      highContrast: 'Contraste élevé',
      darkMode: 'Mode Sombre',
      lightMode: 'Mode Clair',
    },
  },
  de: {
    appName: 'GeoPulse',
    tagline: 'Karten & Pendel-Alarme',
    tabs: {
      map: 'Karte & Route',
      commute: 'Pendeln & Kalender',
      chat: 'Such-Assistent',
      analytics: 'Nutzung & Verlauf',
      security: 'Datenschutz',
      docs: 'Spezifikationen',
    },
    map: {
      searchPlaceholder: 'Adresse oder Ort suchen...',
      pinLocation: 'Ort markieren',
      planRoute: 'Route berechnen',
      saveRoute: 'Route speichern',
      savedPins: 'Gespeicherte Orte',
      clearRoute: 'Route zurücksetzen',
      trafficHeatmap: 'Verkehrsfluss',
      clickToPinNotice: 'Auf die Karte klicken, um einen Ort hinzuzufügen',
    },
    commute: {
      title: 'Abfahrtsalarme & Kalender',
      subtitle: 'Dynamische Abfahrtszeiten für Ihre Termine',
      leaveBy: 'Abfahrtszeit',
      calendarEvents: 'Geplante Termine',
      alertRules: 'Alarm-Regeln',
      testPushAlert: 'Test-Alarm senden',
      addEvent: 'Termin hinzufügen',
    },
    chat: {
      title: 'Standort-Assistent',
      subtitle: 'Echtzeit-Standortsuche mit Google Search Grounding',
      inputPlaceholder: 'Fragen Sie nach Orten oder Wegen...',
      send: 'Suchen',
      groundingCitations: 'Quellen',
    },
    admin: {
      title: 'Aktivität & Statistiken',
      subtitle: 'Übersicht über Ihre tatsächlichen Routen und Alarme',
      totalRoutes: 'Gespeicherte Routen',
      totalPins: 'Gespeicherte Orte',
      scheduledEvents: 'Kommende Termine',
      activityLog: 'Aktivitäts-Protokoll',
    },
    security: {
      title: 'Sicherheit & Datenschutz',
      biometricTitle: 'Biometrische Sperre',
      biometricDesc: 'Authentifizierung per Fingerabdruck oder Gesicht.',
      gdprTitle: 'Datenverwaltung',
      exportData: 'Daten exportieren (JSON)',
      purgeData: 'Alle Daten löschen',
    },
    common: {
      offlineMode: 'Offline',
      onlineMode: 'Online',
      lockScreen: 'Sperren',
      highContrast: 'Hoher Kontrast',
      darkMode: 'Dunkel',
      lightMode: 'Hell',
    },
  },
  ja: {
    appName: 'GeoPulse',
    tagline: 'マップナビ＆出発アラート',
    tabs: {
      map: '地図・ルート',
      commute: '通勤・予定',
      chat: '検索アシスタント',
      analytics: '利用状況',
      security: 'セキュリティ',
      docs: '設計書',
    },
    map: {
      searchPlaceholder: '住所または場所を検索...',
      pinLocation: 'ピンを打つ',
      planRoute: 'ルート案内',
      saveRoute: 'ルート保存',
      savedPins: '保存済み地点',
      clearRoute: 'ルート解除',
      trafficHeatmap: '渋滞表示',
      clickToPinNotice: '地図をクリックして任意の地点を追加',
    },
    commute: {
      title: '出発アラートと予定連携',
      subtitle: '予定に合わせた出発時間の自動算出',
      leaveBy: '出発推奨時刻',
      calendarEvents: '登録済み予定',
      alertRules: '通知ルール',
      testPushAlert: 'テスト通知を送信',
      addEvent: '予定を追加',
    },
    chat: {
      title: '検索アシスタント',
      subtitle: 'Google Search Groundingによる実情報検索',
      inputPlaceholder: '場所やルートについて質問...',
      send: '検索',
      groundingCitations: '参照情報',
    },
    admin: {
      title: '利用アクティビティ',
      subtitle: '保存ルートや登録ピンの実際の利用ログ',
      totalRoutes: '保存ルート数',
      totalPins: '保存地点数',
      scheduledEvents: '予定件数',
      activityLog: '操作ログ',
    },
    security: {
      title: 'プライバシーとセキュリティ',
      biometricTitle: '生体認証ロック',
      biometricDesc: '予定表示前に生体認証を要求します。',
      gdprTitle: 'データ管理',
      exportData: 'データ出力 (JSON)',
      purgeData: '保存データを全消去',
    },
    common: {
      offlineMode: 'オフライン',
      onlineMode: '接続中',
      lockScreen: 'ロック',
      highContrast: '高コントラスト',
      darkMode: 'ダーク',
      lightMode: 'ライト',
    },
  },
  sw: {
    appName: 'GeoPulse',
    tagline: 'Ramani na Arifa za Kuondoka',
    tabs: {
      map: 'Ramani na Njia',
      commute: 'Safari na Kalenda',
      chat: 'Msaidizi wa Utafutaji',
      analytics: 'Shughuli za Matumizi',
      security: 'Faragha na Usalama',
      docs: 'Nyaraka',
    },
    map: {
      searchPlaceholder: 'Tafuta anwani au eneo...',
      pinLocation: 'Weka Alama',
      planRoute: 'Elekeza Njia',
      saveRoute: 'Hifadhi Njia',
      savedPins: 'Maeneo Yaliyohifadhiwa',
      clearRoute: 'Ondoa Njia',
      trafficHeatmap: 'Hali ya Trafiki',
      clickToPinNotice: 'Bofya kwenye ramani kuweka eneo jipya',
    },
    commute: {
      title: 'Arifa za Kuondoka na Kalenda',
      subtitle: 'Muda halisi wa kuondoka kulingana na mikutano yako',
      leaveBy: 'Saa ya Kuondoka',
      calendarEvents: 'Mikutano Iliyopangwa',
      alertRules: 'Kanuni za Arifa',
      testPushAlert: 'Tuma Jaribio la Arifa',
      addEvent: 'Ongeza Mkutano',
    },
    chat: {
      title: 'Msaidizi wa Eneo',
      subtitle: 'Utafutaji unaotumia taarifa za Google Search Grounding',
      inputPlaceholder: 'Uliza kuhusu eneo au safari...',
      send: 'Tafuta',
      groundingCitations: 'Vyanzo',
    },
    admin: {
      title: 'Kumbukumbu ya Matumizi',
      subtitle: 'Muhtasari halisi wa njia na maeneo uliyohifadhi',
      totalRoutes: 'Njia Zilizohifadhiwa',
      totalPins: 'Maeneo Yaliyohifadhiwa',
      scheduledEvents: 'Mikutano Iliyopo',
      activityLog: 'Kumbukumbu ya Matendo',
    },
    security: {
      title: 'Usalama na Faragha',
      biometricTitle: 'Kufunga kwa Alama ya Kidole',
      biometricDesc: 'Thibitisha utambulisho kabla ya kuona mikutano.',
      gdprTitle: 'Usimamizi wa Data',
      exportData: 'Pakua Data (JSON)',
      purgeData: 'Futa Data Yote',
    },
    common: {
      offlineMode: 'Bila Mtandao',
      onlineMode: 'Imeunganishwa',
      lockScreen: 'Funga',
      highContrast: 'Tofauti Kubwa',
      darkMode: 'Hali ya Giza',
      lightMode: 'Hali ya Mwangaza',
    },
  },
};
