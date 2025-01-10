import React from 'react';
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';

const AnimatedCard = styled(motion.div)(({ theme }) => ({
  width: '100%',
  maxWidth: '300px',
  margin: theme.spacing(2),
  perspective: '1000px',
}));

const Card = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  borderRadius: '12px',
  border: '2px solid #E2F1F7',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '25px',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-10px) rotateX(3deg)',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    borderColor: theme.palette.primary.main,
  }
}));

const IconImage = styled('img')(({ theme }) => ({
  width: '80px',
  height: '80px',
  objectFit: 'contain',
  marginTop: theme.spacing(2),
  transition: 'transform 0.3s ease',
}));

const CardFeatures = ({ isMobile }) => {
  const cardVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 300
      }
    }
  };

  const cardDetails = [
    {
      title: ' Instant Clarity, Instant Action',
      description: 'Extract key insights from insurance documents for faster decisions.',
      icon: require('../../assets/Upload_file.png')
    },
    {
      title: 'Simplified Document Understanding',
      description: 'Turn insurance documents into concise, actionable summaries instantly',
      icon: require('../../assets/Instant_Summary.png')
    },
    {
      title: 'AI-Powered Summary Precision',
      description: 'AI-driven summaries providing accurate, relevant insights for insurance instantly.',
      icon: require('../../assets/AI_analysis.png')
    }
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'stretch',
        py: 4,
        marginBottom: "-180px",
      }}
    >
      {cardDetails.map((card, index) => (
        <AnimatedCard
          key={index}
          whileHover="hover"
          variants={cardVariants}
          sx={{
            flex: '1 1 calc(33.333% - 16px)',
            maxWidth: '300px',
            margin: '8px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'stretch',
          }}
        >
          <Card
            sx={{
              width: '100%',
              height: '250px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 2,
            }}
          >
            <Typography
              className="Nasaliza"
              variant="h6"
              sx={{
                color: 'primary.main',
                textAlign: 'center',
                mb: 2,
              }}
            >
              {card.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                textAlign: 'center',
                mb: 2,
              }}
            >
              {card.description}
            </Typography>
            <IconImage
              src={card.icon}
              alt={`Icon ${index + 1}`}
              sx={{
                width: '60px',
                height: '60px',
                '&:hover': {
                  transform: 'scale(1.1) rotate(5deg)',
                },
              }}
            />
          </Card>
        </AnimatedCard>
      ))}
    </Box>
  );
};

export default function CardSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box sx={{ padding: isMobile ? '20px' : '200px', fontFamily: 'Georgia, Times, serif', marginTop: '-150px' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }} className='Nasaliza'>
        The Competitive Edge of DocAI™ Summary: Transforming P&C Insurance Workflows
      </Typography>
      <Typography variant="body1" sx={{
        mb: 4, fontFamily:
          "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
      }}>
        DocAI™ delivers precise document summarization, uncovering hidden patterns and trends, enabling faster, smarter decisions, and offering a distinct competitive advantage in the data-driven P&C insurance industry.
      </Typography>
      <CardFeatures isMobile={isMobile} />
    </Box>
  );
}
