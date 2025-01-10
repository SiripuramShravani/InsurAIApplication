import { styled, ThemeProvider } from '@mui/material/styles';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography, Grid } from '@mui/material';
import MainCard from './UIComponents-NewDashbaordUI/MainCard';
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import PropTypes from 'prop-types';
import themeFunction from './UIComponents-NewDashbaordUI/themes';
const theme = themeFunction(); // Call function to get the theme

const ClaimsChannelsCard = ({
    icon: IconComponent,
    type,
    title,
    ColorUI,
    clickedCard,
    setClickedCard,
    onCardClick,
    Count
}) => {
    const handleClick = () => {
        setClickedCard((prevClickedCard) =>
            prevClickedCard === title ? "" : title // Conditionally set clickedCard
        );
        onCardClick(title);
    };

    const CardWrapper = styled(MainCard)(({ theme, ColorUI }) => ({
        overflow: 'hidden',
        position: 'relative',
        '&:after': {
            content: '""',
            position: 'absolute',
            width: 210,
            height: 210,
            background: `linear-gradient(210.04deg, ${theme.palette[ColorUI].dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
            borderRadius: '50%',
            top: -30,
            right: -180
        },
        '&:before': {
            content: '""',
            position: 'absolute',
            width: 210,
            height: 210,
            background: `linear-gradient(140.9deg, ${theme.palette[ColorUI].dark} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
            borderRadius: '50%',
            top: -160,
            right: -130
        }
    }));


    return (
        <ThemeProvider theme={theme}>
            <CardWrapper border={false} content={false} ColorUI={ColorUI}>
                <Box sx={{ p: 2 }}>
                    <Grid container alignItems="center" justifyContent="space-between"> {/* Use Grid for layout */}
                        <Grid item md={12}>  {/* Content on the left */}
                            <List sx={{ py: 0 }}>
                                <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                                    <ListItemAvatar>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.largeAvatar,
                                                backgroundColor: theme.palette[ColorUI].light,
                                                color: theme.palette[ColorUI].dark,
                                                cursor: 'default'
                                            }}
                                        >
                                            <IconComponent fontSize="inherit" />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        sx={{
                                            py: 0,
                                            mt: 0.45,
                                            mb: 0.45
                                        }}
                                        primary={<Typography variant="h4">{title}</Typography>}
                                        secondary={
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    color: theme.palette.grey[500],
                                                    mt: 0.5
                                                }}
                                            >
                                                {type} : {Count}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            </List>
                        </Grid>
                        <Grid
                            item
                            md={12}
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end", // Align items towards the right
                                alignItems: "center", // Center vertically
                                pr: 4, // Add some padding to move it away from the right edge
                            }}
                        >
                            <Avatar
                                variant="rounded"
                                sx={{
                                    ...theme.typography.commonAvatar,
                                    ...theme.typography.largeAvatar,
                                    backgroundColor: theme.palette[ColorUI].light,
                                    color: theme.palette[ColorUI].dark,
                                    zIndex: 1,
                                }}
                                aria-controls="menu-earning-card"
                                aria-haspopup="true"
                                onClick={handleClick}
                            >
                                {clickedCard === title ? (
                                    <ArrowUpwardOutlinedIcon fontSize="inherit" />
                                ) : (
                                    <ArrowDownwardOutlinedIcon fontSize="inherit" />
                                )}
                            </Avatar>
                        </Grid>
                    </Grid>
                </Box>
            </CardWrapper>
        </ThemeProvider>
    );
};
ClaimsChannelsCard.propTypes = {
    isLoading: PropTypes.bool,
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.elementType.isRequired,
    ColorUI: PropTypes.oneOf(['primary', 'secondary', 'error', 'warning', 'info', 'success', 'ColorUI']).isRequired,
    clickedCard: PropTypes.string,
    setClickedCard: PropTypes.func,
    onCardClick: PropTypes.func
};

export default ClaimsChannelsCard;
