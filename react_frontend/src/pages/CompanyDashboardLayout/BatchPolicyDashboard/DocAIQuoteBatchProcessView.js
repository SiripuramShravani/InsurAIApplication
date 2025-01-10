import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip
} from 'recharts';
import CloseIcon from '@mui/icons-material/Close';
const COLORS = {
    primary: '#6366F1',
    success: '#059669',
    failure: '#DC2626',
    warning: '#D97706',
    background: '#F8FAFC',
    cardBg: '#FFFFFF',
    text: '#1E293B',
    textSecondary: '#64748B',
    border: '#E2E8F0',
    hover: '#F1F5F9'
};

const styles = {
    container: {
        padding: '32px',
        backgroundColor: COLORS.background,
        borderRadius: '24px',
        color: COLORS.text,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
    },
    title: {
        fontSize: '24px',
        fontWeight: '600',
        color: COLORS.text,
        margin: '0'
    },
    cancelButton: {
        backgroundColor: COLORS.cardBg,
        color: COLORS.text,
        border: `1px solid ${COLORS.border}`,
        padding: '10px 20px',
        borderRadius: '12px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s ease'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px'
    },
    card: {
        padding: '24px',
        borderRadius: '16px',
        backgroundColor: COLORS.cardBg,
        border: `1px solid ${COLORS.border}`,
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
    },
    cardContent: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    },
    iconContainer: {
        width: '52px',
        height: '52px',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px'
    },
    cardInfo: {
        flex: 1
    },
    cardTitle: {
        fontSize: '14px',
        fontWeight: '500',
        color: COLORS.textSecondary,
        margin: '0 0 4px 0'
    },
    cardValue: {
        fontSize: '28px',
        fontWeight: '600',
        color: COLORS.text,
        margin: '0',
        lineHeight: '1.2'
    },
    chartCard: {
        padding: '24px',
        borderRadius: '16px',
        backgroundColor: COLORS.cardBg,
        border: `1px solid ${COLORS.border}`,
        height: '400px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
    },
    tooltipContent: {
        backgroundColor: COLORS.cardBg,
        border: `1px solid ${COLORS.border}`,
        padding: '12px 16px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const percentage = ((data.value / (data.success + data.failure)) * 100).toFixed(1);
        return (
            <div style={styles.tooltipContent}>
                <p style={{ margin: '0', fontWeight: '600', color: COLORS.text }}>
                    {payload[0].name}
                </p>
                <p style={{ margin: '4px 0 0', color: COLORS.textSecondary }}>
                    {`${payload[0].value} (${percentage}%)`}
                </p>
            </div>
        );
    }
    return null;
};

const BatchProcessDashboard = ({ reportData, onCancel }) => {
    const { total_files = 0, success = 0, failure = 0, processing_time = 0 } = reportData?.Report || {};
    const stats = [
        {
            title: 'Total Files',
            value: total_files,
            icon: '📊',
            color: COLORS.primary
        },
        {
            title: 'Success',
            value: success,
            icon: '✅',
            color: COLORS.success
        },
        {
            title: 'Failure',
            value: failure,
            icon: '❌',
            color: COLORS.failure
        },
        {
            title: 'Processing Time',
            value: `${processing_time.toFixed(1)}s`,
            icon: '⚡',
            color: COLORS.warning
        }
    ];

    const pieData = [
        { name: 'Success', value: success, success, failure, color: COLORS.success },
        { name: 'Failed', value: failure, success, failure, color: COLORS.failure }
    ];

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>DocAI™ Quote Batch Process Analysis</h2>
                <button
                    style={styles.cancelButton}
                    onClick={onCancel}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = COLORS.hover;
                        e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = COLORS.cardBg;
                        e.target.style.transform = 'translateY(0)';
                    }}
                >
                    <CloseIcon style={{ marginRight: '8px', fontSize: '16px' }} />
                    Close Analysis
                </button>
            </div>

            <div style={styles.grid}>
                <div style={styles.statsGrid}>
                    {stats.map((stat) => (
                        <div
                            key={stat.title}
                            style={styles.card}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 8px 16px -4px rgba(0, 0, 0, 0.1)';
                                e.currentTarget.style.borderColor = stat.color;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                                e.currentTarget.style.borderColor = COLORS.border;
                            }}
                        >
                            <div style={styles.cardContent}>
                                <div style={{
                                    ...styles.iconContainer,
                                    backgroundColor: `${stat.color}10`,
                                    color: stat.color
                                }}>
                                    {stat.icon}
                                </div>
                                <div style={styles.cardInfo}>
                                    <p style={styles.cardTitle}>{stat.title}</p>
                                    <p style={styles.cardValue}>{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={styles.chartCard}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={85}
                                outerRadius={120}
                                paddingAngle={8}
                                dataKey="value"
                                cornerRadius={12}
                                startAngle={90}
                                endAngle={450}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                        stroke="transparent"
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                verticalAlign="middle"
                                align="right"
                                layout="vertical"
                                iconType="circle"
                                formatter={(value, entry) => {
                                    const data = entry.payload;
                                    const percentage = ((data.value / (data.success + data.failure)) * 100).toFixed(1);
                                    return (
                                        <span style={{ color: COLORS.text, fontSize: '14px' }}>
                                            {`${value} (${percentage}%)`}
                                        </span>
                                    );
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default BatchProcessDashboard;