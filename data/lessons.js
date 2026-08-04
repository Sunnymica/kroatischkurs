window.KROATISCH_LESSONS = [
  {
    id: "lekcija-1",
    number: 1,
    status: "available",
    title: "Dobar dan, susjeda!",
    subtitle: "Wetter, Spaziergang und ein kurzer Plausch",
    description: "Du begrüßt Nachbarn, reagierst auf das Wetter und sagst in natürlichen Sätzen, was du gerade machst.",
    duration: "30–40 Min.",
    color: "blue",
    focus: ["Hören", "Sprechen", "Satzmuster"],
    vocabulary: [
      {hr:"danas",de:"heute",note:"Zeitangabe; steht oft am Satzanfang."},
      {hr:"divan / divna / divno",de:"wunderschön",note:"Passt sich dem Nomen an: divan dan."},
      {hr:"zar ne?",de:"nicht wahr? / oder?",note:"Freundliche Rückfrage am Satzende."},
      {hr:"šetnja",de:"Spaziergang",note:"u šetnji = beim Spazierengehen."},
      {hr:"uživati u + Lokativ",de:"etwas genießen",note:"uživam u šetnji = ich genieße den Spaziergang."},
      {hr:"vrt",de:"Garten",note:"u vrtu = im Garten."},
      {hr:"raditi",de:"arbeiten / etwas tun",note:"radim u vrtu = ich arbeite im Garten."},
      {hr:"malo",de:"ein bisschen",note:"Macht Antworten natürlicher und weicher."}
    ],
    phases: [
      {id:"susret",label:"Begegnen",short:"Hören und wiedererkennen",steps:[
        {id:"susret-dialog",type:"dialogue",eyebrow:"Begegnen",title:"Ein kurzer Plausch am Gartentor",intro:"Hör zuerst nur zu. Du musst noch nichts behalten.",dialogue:[
          {speaker:"Marija",side:"left",hr:"Dobar dan! Danas je divan dan, zar ne?",de:"Guten Tag! Heute ist ein wunderschöner Tag, nicht wahr?"},
          {speaker:"Regina",side:"right",hr:"Da, napokon! Uživam u šetnji danas.",de:"Ja, endlich! Ich genieße heute den Spaziergang."},
          {speaker:"Marija",side:"left",hr:"Ideš li do mora?",de:"Gehst du zum Meer?"},
          {speaker:"Regina",side:"right",hr:"Ne, samo malo šetam. Poslije radim u vrtu.",de:"Nein, ich gehe nur ein bisschen spazieren. Später arbeite ich im Garten."}
        ]},
        {id:"susret-echo",type:"echo",eyebrow:"Nachsprechen",title:"Drei Sätze in deinem Rhythmus",intro:"Hör jeden Satz an, sprich ihn laut nach und markiere ihn danach.",prompts:[
          {id:"e1",hr:"Danas je divan dan, zar ne?",de:"Heute ist ein wunderschöner Tag, nicht wahr?"},
          {id:"e2",hr:"Uživam u šetnji danas.",de:"Ich genieße heute den Spaziergang."},
          {id:"e3",hr:"Poslije radim u vrtu.",de:"Später arbeite ich im Garten."}
        ]}
      ]},
      {id:"razumjeti",label:"Verstehen",short:"Bedeutung sichern",steps:[
        {id:"razumjeti-auswahl",type:"choice",eyebrow:"Verstehen",title:"Was sagt Regina?",intro:"Wähle die passende Bedeutung.",question:"Ne, samo malo šetam. Poslije radim u vrtu.",options:[
          {text:"Nein, ich gehe nur kurz spazieren. Später arbeite ich im Garten.",correct:true},
          {text:"Nein, ich arbeite heute nicht. Später gehe ich ans Meer.",correct:false},
          {text:"Ja, ich gehe zum Meer und danach in den Garten.",correct:false}
        ],explanation:"samo malo = nur ein bisschen; poslije = später; u vrtu = im Garten"},
        {id:"razumjeti-zuordnen",type:"matching",eyebrow:"Bedeutung verbinden",title:"Welche Teile gehören zusammen?",intro:"Ordne die kroatischen Bausteine ihrer deutschen Bedeutung zu.",pairs:[
          ["danas","heute"],["zar ne?","nicht wahr?"],["samo malo","nur ein bisschen"],["poslije","später"],["u vrtu","im Garten"]
        ]}
      ]},
      {id:"muster",label:"Muster erkennen",short:"Sätze statt Regeln",steps:[
        {id:"muster-zeit",type:"pattern",eyebrow:"Satzmuster",title:"Zeitangaben dürfen nach vorn",intro:"Für spontane Alltagssätze hilft dieses einfache Muster:",pattern:["Danas","uživam","u šetnji."],examples:[
          ["Danas radim u vrtu.","Heute arbeite ich im Garten."],["Poslije idem do mora.","Später gehe ich zum Meer."],["Sada samo malo šetam.","Jetzt gehe ich nur ein bisschen spazieren."]
        ],note:"Ja ist meist überflüssig: Die Verbform uživam zeigt schon, dass du von dir sprichst."},
        {id:"muster-u",type:"pattern",eyebrow:"Baustein",title:"uživati u + Lokativ",intro:"Lerne die Verbindung als Ganzes.",pattern:["Uživam","u","šetnji."],examples:[
          ["Uživam u miru.","Ich genieße die Ruhe."],["Uživam u suncu.","Ich genieße die Sonne."],["Uživam u razgovoru.","Ich genieße das Gespräch."]
        ],note:"Als Sprechbaustein speichern: uživam u …"}
      ]},
      {id:"einschleifen",label:"Einschleifen",short:"Abrufbar machen",steps:[
        {id:"einschleifen-bauen",type:"builder",eyebrow:"Satz bauen",title:"Baue einen natürlichen Satz",intro:"Tippe die Bausteine in der richtigen Reihenfolge an.",prompt:"Heute genieße ich den Spaziergang.",tokens:["šetnji.","Danas","u","uživam"],answer:["Danas","uživam","u","šetnji."]},
        {id:"einschleifen-luecke",type:"cloze",eyebrow:"Satz ergänzen",title:"Welcher Baustein fehlt?",intro:"Schreibe nur das fehlende Wort.",before:"Poslije radim",after:"vrtu.",answer:"u",hint:"im Garten = u vrtu"},
        {id:"einschleifen-reaktion",type:"choice",eyebrow:"Schnell reagieren",title:"Welche Antwort klingt passend?",intro:"Marija sagt: Danas je baš lijepo!",question:"Was antwortest du?",options:[
          {text:"Da, napokon! Uživam u šetnji.",correct:true},{text:"Ne, vrt je jučer.",correct:false},{text:"Dobro jutro more radim.",correct:false}
        ],explanation:"Da, napokon! = Ja, endlich! Danach folgt ein natürlicher Satz."}
      ]},
      {id:"varirati",label:"Variieren",short:"Eigene Aussagen bilden",steps:[
        {id:"varirati-generator",type:"generator",eyebrow:"Variieren",title:"Baue deinen eigenen Satz",intro:"Wähle je einen Baustein und sprich den Satz laut.",slots:[
          {label:"Wann?",options:["Danas","Sada","Poslije"]},{label:"Was?",options:["uživam","radim","šetam"]},{label:"Wobei / wo?",options:["u šetnji.","u vrtu.","samo malo."]}
        ]},
        {id:"varirati-frei",type:"free",eyebrow:"Dein Satz",title:"Antworte als du selbst",intro:"Jemand fragt: Što radiš danas?",prompt:"Sprich zuerst. Schreibe deinen Satz erst danach als Gedächtnisstütze auf.",placeholder:"Zum Beispiel: Danas radim u vrtu."}
      ]},
      {id:"transfer",label:"Transfer",short:"Im echten Leben einsetzen",steps:[
        {id:"mission",type:"mission",eyebrow:"Deine Mission",title:"Ein echter Satz außerhalb der Lektion",intro:"Ein einziger selbst gebauter Satz reicht.",sentence:"Danas je divan dan, zar ne?",alternatives:["Danas radim u vrtu.","Samo malo šetam.","Uživam u šetnji danas."],checks:["Ich habe meinen Satz langsam gesprochen.","Ich habe ihn in natürlichem Tempo gesprochen.","Ich habe ihn benutzt oder eine Gelegenheit festgelegt."]},
        {id:"abschluss",type:"summary",eyebrow:"Abschluss",title:"Was jetzt wieder abrufbar ist",intro:"Du hast Gesprächsbausteine aktiviert.",achievements:["auf das Wetter reagieren","sagen, was du heute oder später machst","uživati u … als festen Baustein verwenden","einen Satz für eine echte Begegnung vorbereiten"],suggestions:["Danas je divan dan, zar ne?","Danas uživam u šetnji.","Poslije radim u vrtu."]}
      ]}
    ]
  },
  {id:"lekcija-2",number:2,status:"coming",title:"Kako si ovih dana?",subtitle:"Nachfragen und wirklich antworten",description:"Du gehst über dobro hinaus und erzählst in zwei oder drei Sätzen, wie es dir geht.",duration:"35–45 Min.",color:"terracotta",focus:["Smalltalk","Reaktion","Erzählen"]},
  {id:"lekcija-3",number:3,status:"coming",title:"Što ima u vrtu?",subtitle:"Garten, Pflanzen und kleine Probleme",description:"Du beschreibst, was wächst, was fehlt und wobei du Hilfe brauchst.",duration:"35–45 Min.",color:"olive",focus:["Wortschatz","Lokativ","Fragen"]}
];
