const DocAI_Quote_stepsData = [
    {
        id: 0,
        title: "Start Batch Process",
        description: "Initialize the batch process to get started.",
        icon: "PlayCircle",
        colors: {
            bg: '#9333ea',
            light: '#f3e8ff',
            border: '#9333ea'
        },
        actions: [
            { icon: "PlayCircle", label: "Run Batch", primary: true, apiEndpoint: '/start-batch' },
            { icon: "RefreshCw", label: "Reset", apiEndpoint: '/reset-batch' }
        ]
    },
    {
        id: 1,
        title: "Batch Process Analysis",
        description: "Analyze the processed batch for insights.",
        icon: "BarChart",
        colors: {
            bg: '#3b82f6',
            light: '#e0f2fe',
            border: '#3b82f6'
        },
        actions: [
            { icon: "BarChart", label: "View Analysis", primary: true, apiEndpoint: '/view-analysis' },
            { icon: "Download", label: "Export", apiEndpoint: '/export-analysis' }
        ]
    },
    {
        id: 2,
        title: "Batch Process Quotes",
        description: "View & manage batch process quotes here.",
        icon: "FileText",
        colors: {
            bg: '#10b981',
            light: '#d1fae5',
            border: '#10b981'
        },
        actions: [
            { icon: "FileText", label: "View Quotes", primary: true, apiEndpoint: '/view-quotes' },
            { icon: "Download", label: "Download", apiEndpoint: '/download-quotes' }
        ]
    }
];

export { DocAI_Quote_stepsData }