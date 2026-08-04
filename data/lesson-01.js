window.KPK_LESSONS = window.KPK_LESSONS || {};
window.KPK_LESSONS[1] = {
  id: 1,
  title: "Begegnung auf der Straße",
  eyebrow: "Susret na ulici",
  headline: "Dobar dan!",
  intro: "Du triffst eine Nachbarin beim Spaziergang. Am Ende kannst du begrüßen, auf einen Wetterkommentar reagieren und sagen, dass du den Spaziergang genießt.",
  phases: [
    {
      label: "Szene",
      type: "dialogue",
      title: "Erst hören, dann verstehen",
      lead: "Lies den Dialog zunächst nur mit. Klicke auf „Anhören“, um jeden Satz einzeln zu hören.",
      dialogue: [
        { speaker: "Nachbarin", hr: "Dobar dan!", de: "Guten Tag!" },
        { speaker: "Du", hr: "Dobar dan!", de: "Guten Tag!" },
        { speaker: "Nachbarin", hr: "Danas je baš vruće.", de: "Heute ist es wirklich heiß." },
        { speaker: "Du", hr: "Da, stvarno je vruće.", de: "Ja, es ist wirklich heiß." },
        { speaker: "Nachbarin", hr: "Lijep dan za šetnju.", de: "Ein schöner Tag für einen Spaziergang." },
        { speaker: "Du", hr: "Da, i ja uživam u šetnji.", de: "Ja, ich genieße den Spaziergang auch." }
      ]
    },
    {
      label: "Wörter",
      type: "vocabulary",
      title: "Sechs Bausteine",
      lead: "Nicht einzeln pauken: Lies immer auch den Beispielsatz laut.",
      words: [
        { hr: "dobar dan", de: "guten Tag", example: "Dobar dan!" },
        { hr: "danas", de: "heute", example: "Danas je vruće." },
        { hr: "baš", de: "wirklich / ganz schön", example: "Baš je vruće." },
        { hr: "vruće", de: "heiß", example: "Danas je vruće." },
        { hr: "šetnja", de: "Spaziergang", example: "Idem u šetnju." },
        { hr: "uživam", de: "ich genieße", example: "Uživam u šetnji." }
      ]
    },
    {
      label: "Muster",
      type: "patterns",
      title: "Das Muster: Danas je …",
      lead: "Du veränderst nur ein Wort. Der Satzbau bleibt gleich.",
      patterns: [
        { hr: "Danas je vruće.", de: "Heute ist es heiß." },
        { hr: "Danas je lijepo.", de: "Heute ist es schön." },
        { hr: "Danas je hladno.", de: "Heute ist es kalt." },
        { hr: "Danas pada kiša.", de: "Heute regnet es." }
      ],
      tip: "Merksatz: Bei Wetter sagt man oft einfach „Danas je + Wetterwort“."
    },
    {
      label: "Erkennen",
      type: "quiz",
      title: "Welche Antwort passt?",
      lead: "Wähle die passende Reaktion.",
      question: "Nachbarin: Danas je baš vruće.",
      choices: [
        "Da, stvarno je vruće.",
        "Laku noć!",
        "Vidimo se sutra."
      ],
      answer: 0
    },
    {
      label: "Bauen",
      type: "builder",
      title: "Baue deinen Satz",
      lead: "Klicke die Wörter in der richtigen Reihenfolge an.",
      tokens: ["šetnji.", "u", "uživam", "ja", "I"],
      answer: "I ja uživam u šetnji."
    },
    {
      label: "Sprechen",
      type: "transfer",
      title: "Jetzt bist du dran",
      lead: "Sprich zuerst laut. Schreibe nur dann, wenn du eine Stütze brauchst.",
      prompt: "Ich sage: „Danas je baš vruće.“ Wie antwortest du?",
      help: "Beginne mit: Da, stvarno …",
      sample: "Da, stvarno je vruće.",
      challenge: "Bonus: Ergänze danach „I ja uživam u šetnji.“"
    }
  ]
};
