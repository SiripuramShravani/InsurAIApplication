// material-ui
import { createTheme } from '@mui/material/styles';

// assets
import colors from '../../styles/style.css';

// project imports
import componentStyleOverrides from './compStyleOverride';
import themePalette from './palette';
// import themeTypography from './typography';

/**
 * Represent theme style and structure as per Material-UI
 * @param {JsonObject} customization customization parameter object
 */

export const links = () => [
    {
        rel: 'stylesheet',
        href: colors
    }
];

/**
 * Typography used in theme
 * @param {JsonObject} theme theme customization object
 */

const themeTypography = (theme) => ({
    
        fontFamily: theme?.customization?.fontFamily,
        h6: {
            fontWeight: 500,
            color: theme.heading,
            fontSize: '0.75rem'
        },
        h5: {
            fontSize: '0.875rem',
            color: theme.heading,
            fontWeight: 500
        },
        h4: {
            fontSize: '1rem',
            color: theme.heading,
            fontWeight: 600
        },
        h3: {
            fontSize: '1.25rem',
            color: theme.heading,
            fontWeight: 600
        },
        h2: {
            fontSize: '1.5rem',
            color: theme.heading,
            fontWeight: 700
        },
        h1: {
            fontSize: '2.125rem',
            color: theme.heading,
            fontWeight: 700
        },
        subtitle1: {
            fontSize: '0.875rem',
            fontWeight: 500,
            color: theme.textDark
        },
        subtitle2: {
            fontSize: '0.75rem',
            fontWeight: 400,
            color: theme.darkTextSecondary
        },
        caption: {
            fontSize: '0.75rem',
            color: theme.darkTextSecondary,
            fontWeight: 400
        },
        body1: {
            fontSize: '0.875rem',
            fontWeight: 400,
            lineHeight: '1.334em'
        },
        body2: {
            letterSpacing: '0em',
            fontWeight: 400,
            lineHeight: '1.5em',
            color: theme.darkTextPrimary
        },
        button: {
            textTransform: 'capitalize'
        },
        customInput: {
            marginTop: 1,
            marginBottom: 1,
            '& > label': {
                top: 23,
                left: 0,
                color: theme.grey500,
                '&[data-shrink="false"]': {
                    top: 5
                }
            },
            '& > div > input': {
                padding: '30.5px 14px 11.5px !important'
            },
            '& legend': {
                display: 'none'
            },
            '& fieldset': {
                top: 0
            }
        },
        mainContent: {
            backgroundColor: theme.background,
            width: '100%',
            minHeight: 'calc(100vh - 88px)',
            flexGrow: 1,
            padding: '20px',
            marginTop: '88px',
            marginRight: '20px',
            borderRadius: `${theme?.customization?.borderRadius}px`
        },
        menuCaption: {
            fontSize: '0.875rem',
            fontWeight: 500,
            color: theme.heading,
            padding: '6px',
            textTransform: 'capitalize',
            marginTop: '10px'
        },
        subMenuCaption: {
            fontSize: '0.6875rem',
            fontWeight: 500,
            color: theme.darkTextSecondary,
            textTransform: 'capitalize'
        },
        commonAvatar: {
            cursor: 'pointer',
            borderRadius: '8px'
        },
        smallAvatar: {
            width: '22px',
            height: '22px',
            fontSize: '1rem'
        },
        mediumAvatar: {
            width: '34px',
            height: '34px',
            fontSize: '1.2rem'
        },
        largeAvatar: {
            width: '44px',
            height: '44px',
            fontSize: '1.5rem'
        }
    
});

const theme = (customization) => {
    const color = {
        paper: '#ffffff',
        primaryLight: '#eef2f6',
        primary200: '#90caf9',
        primaryMain: '#2196f3',
        primaryDark: '#1e88e5',
        primary800: '#1565c0',
        customgreenLight: '#34e1e3',
        customgreen200: '#2dcdcf',
        customgreenMain: '#28c5c7',
        customgreenDark: '#159fa1',
        customgreen800: '#0d6f70',
        customyellowLight: '#ebfaf9',
        customyellow200: '#e89a31',
        customyellowMain: '#d48c2a',
        customyellowDark: '#53918e',
        customyellow800: '#ad7121',
        secondaryLight: '#ede7f6',
        secondary200: '#b39ddb',
        secondaryMain: '#673ab7',
        secondaryDark: '#5e35b1',
        secondary800: '#4527a0',
        successLight: '#b9f6ca',
        success200: '#69f0ae',
        successMain: '#00e676',
        successDark: '#00c853',
        errorLight: '#ef9a9a',
        errorMain: '#f44336',
        errorDark: '#c62828',
        orangeLight: '#fbe9e7',
        orangeMain: '#ffab91',
        orangeDark: '#d84315',
        warningLight: '#fff8e1',
        warningMain: '#ffe57f',
        warningDark: '#ffc107',
        grey50: '#F8FAFC',
        grey100: '#EEF2F6',
        grey200: '#E3E8EF',
        grey300: '#CDD5DF',
        grey500: '#697586',
        grey600: '#4B5565',
        grey700: '#364152',
        grey900: '#121926',
        darkPaper: '#111936',
        darkBackground: '#1a223f',
        darkLevel1: '#29314f',
        darkLevel2: '#212946',
        darkTextTitle: '#d7dcec',
        darkTextPrimary: '#bdc8f0',
        darkTextSecondary: '#8492c4',
        darkPrimaryLight: '#eef2f6',
        darkPrimaryMain: '#2196f3',
        darkPrimaryDark: '#1e88e5',
        darkPrimary200: '#90caf9',
        darkPrimary800: '#1565c0',
        darkSecondaryLight: '#d1c4e9',
        darkSecondaryMain: '#7c4dff',
        darkSecondaryDark: '#651fff',
        darkSecondary200: '#b39ddb',
        darkSecondary800: '#6200ea'
    };
    const themeOption = {
        colors: color,
        heading: color.grey900,
        paper: color.paper,
        backgroundDefault: color.paper,
        background: color.primaryLight,
        darkTextPrimary: color.grey700,
        darkTextSecondary: color.grey500,
        textDark: color.grey900,
        menuSelected: color.secondaryDark,
        menuSelectedBack: color.secondaryLight,
        divider: color.grey200,
        customization
    };

    const themeOptions = {
        direction: 'ltr',
        palette: themePalette(themeOption),
        mixins: {
            toolbar: {
                minHeight: '48px',
                padding: '16px',
                '@media (min-width: 600px)': {
                    minHeight: '48px'
                }
            }
        },
        typography: themeTypography(themeOption)
    };

    const themes = createTheme(themeOptions);
    themes.components = componentStyleOverrides(themeOption);

    return themes;
};

export default theme;
