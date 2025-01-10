
import React, { useState } from "react";
import SelectField from '../../Fields/SelectField';

import {
 Box,
  Typography,
  FormControl,
  Paper,
  Grid,
} from "@mui/material";
import useForm from '../PolicyIntake/UseFormData'

const policyInfo = {
    H01: (
      <Box sx={{ textAlign: "left", lineHeight: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          HO-1 Policy
        </Typography>
        <Typography variant="body1">
          • Covers 10 specific perils:
        </Typography>
        <ul>
          <li>Fire</li>
          <li>Theft</li>
          <li>Vandalism</li>
          <li>Smoke damage</li>
          <li>Windstorm</li>
          <li>Hail</li>
          <li>Explosion</li>
          <li>Riot</li>
          <li>Aircraft damage</li>
          <li>Volcanic eruptions</li>
        </ul>
        <Typography variant="body1">
          • Protects only the home’s structure at actual cash value, not covering:
        </Typography>
        <ul>
          <li>Personal property</li>
          <li>Liability</li>
        </ul>
        <Typography variant="body1">
          • Generally less expensive due to limited coverage. Rarely available and may not meet mortgage requirements.
        </Typography>
      </Box>
    ),
    H02: (
      <Box sx={{ textAlign: "left", lineHeight: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          HO-2 Policy
        </Typography>
        <Typography variant="body1">
          Covers additional perils compared to HO-1, including:
        </Typography>
        <ul>
          <li>Weight of snow and ice</li>
          <li>Accidental overflow or discharge of water</li>
          <li>Freezing of plumbing and air conditioning</li>
          <li>Bulging or cracking from a sudden event</li>
          <li>Falling objects</li>
          <li>Sudden electrical damage</li>
        </ul>
        <Typography variant="body1">
          Includes dwelling, personal belongings, liability, additional living expenses, and medical payments. Belongings covered at actual cash value.
        </Typography>
      </Box>
    ),
    H03: (
      <Box sx={{ textAlign: "left", lineHeight: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          HO-3 Policy
        </Typography>
        <Typography variant="body1">
          The most common and comprehensive policy for homeowners, covering:
        </Typography>
        <ul>
          <li>House and belongings</li>
          <li>Liability</li>
          <li>Medical payments</li>
          <li>Additional living expenses</li>
        </ul>
        <Typography variant="body1">
          Provides "open peril" coverage for your house, meaning all perils except specific exclusions such as:
        </Typography>
        <ul>
          <li>Power failure</li>
          <li>Industrial pollution</li>
          <li>Earthquake</li>
          <li>Flooding</li>
          <li>Intentional damage</li>
          <li>War/nuclear accidents</li>
          <li>Pets and insects</li>
          <li>Wear and tear</li>
          <li>Negligence</li>
          <li>Government actions</li>
          <li>Damage or theft in unoccupied homes</li>
          <li>Deterioration due to weather</li>
        </ul>
        <Typography variant="body1">
          Belongings are covered for 16 specific perils, including:
        </Typography>
        <ul>
          <li>Fire or lightning</li>
          <li>Windstorm or hail</li>
          <li>Explosion</li>
          <li>Riot</li>
          <li>Damage by aircraft</li>
          <li>Damage by vehicles</li>
          <li>Smoke</li>
          <li>Vandalism</li>
          <li>Theft</li>
          <li>Volcanic eruption</li>
          <li>Falling objects</li>
          <li>Weight of snow, ice, and sleet</li>
          <li>Accidental water overflow</li>
          <li>Freezing of systems</li>
          <li>Cracking, burning, or tearing of systems</li>
          <li>Short-circuit damage</li>
        </ul>
      </Box>
    ),
    H04: (
      <Box sx={{ textAlign: "left", lineHeight: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          HO-4 Policy
        </Typography>
        <Typography variant="body1">
          Known as renters insurance, the HO-4 policy is designed for people renting houses and apartments. It includes coverage for:
        </Typography>
        <ul>
          <li>Belongings (covered for the same 16 perils as in the HO-3 policy)</li>
          <li>Additional living expenses</li>
          <li>Liability</li>
        </ul>
        <Typography variant="body1">
          Note: This policy does not cover damage to the rental unit itself. Landlords need their own insurance to cover the structure.
        </Typography>
      </Box>
    ),
    H05: (
      <Box sx={{ textAlign: "left", lineHeight: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          HO-5 Policy
        </Typography>
        <Typography variant="body1">
          Known as a comprehensive policy, the HO-5 offers the highest level of insurance coverage for houses and belongings. It covers everything except for exclusions listed in the policy, similar to an HO-3.
        </Typography>
        <ul>
          <li>Covers house and belongings under all circumstances except listed exclusions</li>
          <li>Pays out for replacement costs rather than actual cash value</li>
          <li>Includes coverage for liability, medical payments to others, and additional living expenses</li>
        </ul>
        <Typography variant="body1">
          Note: This policy is often ideal for new construction. Not all insurance companies offer HO-5 policies.
        </Typography>
      </Box>
    ),
    H06: (
      <Box sx={{ textAlign: "left", lineHeight: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          HO-6 Policy
        </Typography>
        <Typography variant="body1">
          The HO-6 policy is designed for condo or co-op owners. Known as "walls-in coverage," this policy covers:
        </Typography>
        <ul>
          <li>Renovations made after purchase</li>
          <li>Walls, floors, and ceilings</li>
          <li>Personal belongings</li>
          <li>Additional living expenses</li>
          <li>Liability</li>
          <li>Medical payments to others</li>
        </ul>
        <Typography variant="body1">
          Before buying an HO-6 policy, review your condo association's insurance to avoid gaps and duplicate coverage.
        </Typography>
      </Box>
    ),
    H07: (
      <Box sx={{ textAlign: "left", lineHeight: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          HO-7 Policy
        </Typography>
        <Typography variant="body1">
          The HO-7 policy offers coverage similar to an HO-3 but is tailored for mobile homes. This open peril policy covers any damage to the structure unless listed as an exclusion. Belongings are covered for specific perils.
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: "bold", mt: 1 }}>
          HO-7 policies cover:
        </Typography>
        <ul>
          <li>Single and double-wide manufactured homes</li>
          <li>Single and double-wide mobile homes</li>
          <li>Trailers</li>
          <li>Sectional homes</li>
          <li>Modular homes</li>
        </ul>
        <Typography variant="body1">
          Note: Coverage typically applies only when the mobile home is stationary, not in transit.
        </Typography>
      </Box>
    ),
    H08: (
      <Box sx={{ textAlign: "left", lineHeight: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          HO-8 Policy
        </Typography>
        <Typography variant="body1">
          The HO-8 policy is designed for older homes, typically over 40 years old, where rebuilding costs exceed the home's market value. Historic homes and registered landmarks often use HO-8 policies. Coverage includes:
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: "bold", mt: 1 }}>
          Specific Perils:
        </Typography>
        <ul>
          <li>Fire or lightning</li>
          <li>Windstorm or hail</li>
          <li>Explosion</li>
          <li>Riot or civil commotion</li>
          <li>Aircraft</li>
          <li>Vehicles</li>
          <li>Smoke</li>
          <li>Vandalism or malicious mischief</li>
          <li>Theft</li>
          <li>Volcanic eruption</li>
        </ul>
        <Typography variant="body1">
          Coverage also includes liability, medical payments to others, and additional living expenses.
        </Typography>
      </Box>
    ),
  };

export default function TypesOfPolicies() {
    const [stateError, setStateError] = useState(false);
    // const [selectedPolicy, setSelectedPolicy] = useState("");

    const [formData, handlePolicyChange] = useForm({
        selectedPolicy:""
    });
   
  
    
        return (
            <Grid
                container
                sx={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: 'center',
                    padding: 2,
                    overflowX: "hidden",
                    margin: "auto"
                }}
            >
                <Grid item xs={12} md={6} textAlign='center'>
                    <Typography
                        variant="h4"
                        sx={{ fontWeight: 600, mb: 2, color: "#010066", textAlign: 'left' }}
                    >
                        Type of Policy
                    </Typography>
                    <Paper
                        elevation={2}
                        sx={{
                            padding: 2,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: '100%',
                            maxWidth: 600
                        }}
                    >
                        <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                            <SelectField
                                value={formData.selectedPolicy}
                                onChange={handlePolicyChange}
                                label="Select Policy Type"
                                options={Object.keys(policyInfo).map(key => ({ value: key, label: key }))}
                                error={stateError}
                                helperText={stateError ? 'Select a policy' : ''}
                                required
                                labelId="select-policy-label"
                                name="selectedPolicy"
                                autoComplete="selectedPolicy"
                            />
                        </FormControl>
                        {formData.selectedPolicy && (
                            <Paper sx={{ mt: 2, width: '100%', maxWidth: 600, textAlign: 'center', p: 2 }}>
                                {policyInfo[formData.selectedPolicy]}
                            </Paper>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        );
    
}