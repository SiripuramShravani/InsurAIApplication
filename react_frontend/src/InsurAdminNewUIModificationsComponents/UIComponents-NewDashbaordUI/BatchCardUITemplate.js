import {
    PlayCircle,
    BarChart,
    FileText,
    Check,
    Loader2,
    RefreshCw,
    Download,
    ChevronRight
} from 'lucide-react';
import { Grid } from '@mui/material';

const styles = {
    cardWrapper: {
        position: 'relative'
    },
    connectionLine: {
        position: 'absolute',
        top: '60%',
        right: '-114px',
        width: '22%',
        zIndex: 0
    },
    line: {
        height: '4px',
        width: '100%',
        transition: 'background-color 0.3s'
    },
    chevronContainer: {
        position: 'absolute',
        right: '-4px',
        top: '50%',
        transform: 'translateY(-50%)',
        borderRadius: '50%',
        padding: '8px',
        transition: 'background-color 0.3s'
    },
    card: {
        position: 'relative',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s',
        minHeight: '330px'
    },
    cardHeader: {
        padding: '24px',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px'
    },
    headerContent: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px'
    },
    iconContainer: {
        padding: '12px',
        borderRadius: '8px',
        color: 'white',
        flexShrink: 0
    },
    titleContainer: {
        flex: 1,
        minWidth: 0
    },
    title: {
        fontSize: '20px',
        fontWeight: 600,
        marginBottom: '8px',
        color: '#1a202c',
        textAlign: 'left'
    },
    description: {
        fontSize: '14px',
        lineHeight: '1.5',
        color: '#6b7280',
        textAlign: 'left'
    },
    cardContent: {
        padding: '24px'
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    button: {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        border: '1px solid transparent',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontWeight: 500
    },
    buttonOutline: {
        backgroundColor: 'transparent',
        border: '1px solid #e2e8f0',
        color: '#1a202c'
    },
    statusIndicator: {
        position: 'absolute',
        top: '-12px',
        left: '-12px',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        border: '2px solid white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '12px',
        fontWeight: 500
    },
    loader: {
        animation: 'spin 1s linear infinite'
    },
    cardActive: {
        boxShadow: '0 0 0 2px white, 0 0 0 4px #3b82f6 !important'
    }
};

const iconMap = {
    PlayCircle,
    BarChart,
    FileText,
    RefreshCw,
    Download,
};

const BatchCardUITemplate = ({
    step,
    index,
    currentStep,
    isProcessing,
    handleAction,
    steps,
    apiStatus,
    activeCard,
    batchRunCompleted,
    isBatchProcessing,
    showDocAIQuoteBatchProcessView,
    showDocAIQuoteBatchQuotesView,
    isLoading
}) => {
    const renderIcon = (iconName) => {
        const IconComponent = iconMap[iconName];
        if (IconComponent) {
            return <IconComponent style={{ width: '32px', height: '32px' }} />;
        }
        return null;
    };

    const renderActionIcon = (iconName) => {
        const IconComponent = iconMap[iconName];
        if (IconComponent) {
            return <IconComponent style={{ width: '20px', height: '20px' }} />
        }
        return null;
    };

    const isActiveCard = step.title === activeCard;
    const isStepCompleted = index <= currentStep && (
        index < currentStep ||
        (activeCard === step.title && step.actions.some(action =>
            action.primary && apiStatus[action.label] === 'success'
        ))
    );

    const isButtonDisabled = (action) => {
        if (index > currentStep || isProcessing || apiStatus[action.label] === 'loading') {
            return true;
        }
        if (action.label === "Run Batch" && batchRunCompleted) {
            return true;
        }
        if (action.label === "Reset" && isBatchProcessing) {
            return true;
        }
        if (action.label === "Export" && !showDocAIQuoteBatchProcessView) {
            return true;
        }
        if (action.label === "Download" && !showDocAIQuoteBatchQuotesView && !isLoading) {
            return true;
        }
        return false;
    };

    return (
        <Grid item xs={4} md={4} style={styles.cardWrapper}>
            {index < steps.length - 1 && (
                <div style={styles.connectionLine}>
                    <div style={{
                        ...styles.line,
                        backgroundColor: isStepCompleted ? step.colors.bg : '#e2e8f0'
                    }} />
                    <div style={{
                        ...styles.chevronContainer,
                        backgroundColor: isStepCompleted ? step.colors.bg : '#e2e8f0'
                    }}>
                        <ChevronRight style={{
                            width: '28px',
                            height: '24px',
                            color: isStepCompleted ? 'white' : '#94a3b8'
                        }} />
                    </div>
                </div>
            )}

            <div style={{
                ...styles.card,
                ...(isActiveCard && {
                    boxShadow: `0 0 0 2px white, 0 0 0 4px ${step.colors.border}`
                }),
                ...(index > currentStep && { opacity: 0.6 })
            }}>
                <div style={{
                    ...styles.cardHeader,
                    backgroundColor: step.colors.light
                }}>
                    <div style={styles.headerContent}>
                        <div style={{
                            ...styles.iconContainer,
                            backgroundColor: step.colors.bg
                        }}>
                            {isStepCompleted ? (
                                <Check style={{ width: '32px', height: '32px' }} />
                            ) : (
                                renderIcon(step.icon)
                            )}
                        </div>
                        <div style={styles.titleContainer}>
                            <h3 style={styles.title}>{step.title}</h3>
                            <p style={styles.description}>{step.description}</p>
                        </div>
                    </div>
                </div>

                <div style={styles.cardContent}>
                    <div style={styles.buttonContainer}>
                        {step.actions.map((action, actionIndex) => (
                            <button
                                key={actionIndex}
                                style={{
                                    ...styles.button,
                                    ...(action.primary ? {
                                        backgroundColor: step.colors.bg,
                                        color: 'white'
                                    } : styles.buttonOutline),
                                    ...(isButtonDisabled(action) ? {
                                        opacity: 0.5,
                                        cursor: 'not-allowed'
                                    } : {})
                                }}
                                onClick={() => handleAction(step.id, action.primary, action.label, action.apiEndpoint)}
                                disabled={isButtonDisabled(action)}
                            >
                                {apiStatus[action.label] === 'loading' ? (
                                    <Loader2 style={{
                                        width: '20px',
                                        height: '20px',
                                        ...styles.loader
                                    }} />
                                ) : (
                                    renderActionIcon(action.icon)
                                )}
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{
                    ...styles.statusIndicator,
                    backgroundColor: isStepCompleted ? '#22c55e' :
                        index === currentStep ? step.colors.bg : '#e2e8f0'
                }}>
                    {index + 1}
                </div>
            </div>
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </Grid>
    );
};

export default BatchCardUITemplate;