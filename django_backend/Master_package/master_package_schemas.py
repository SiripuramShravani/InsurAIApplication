from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timedelta
import pytz


class User_details(BaseModel):
    first_name: str
    last_name: str
    mobile_number: int
    email_id: str
    role: str
    company_name: Optional[str]


class RefreshTokenDetails(BaseModel):
    # id: Optional[ObjectId]
    refresh_token: str
    user_id: str
    created_at: str = Field(default_factory=lambda: datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%Y-%m-%dT%H:%M:%S%z'))
    # expires_at: str = Field(default_factory=lambda: (datetime.now(pytz.timezone('Asia/Kolkata')) + timedelta(minutes=20)).strftime('%Y-%m-%dT%H:%M:%S%z'))
    expires_at: str = Field(default_factory=lambda: (datetime.now(pytz.timezone('Asia/Kolkata')) + timedelta(days=1)).strftime('%Y-%m-%dT%H:%M:%S%z'))
    device_info: Optional[str]


from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


class PolicyInfo(BaseModel):
    selectedPolicy: str
    policy_holder_FirstName: str
    policy_holder_LastName: str
    policy_holder_street_number: int
    policy_holder_street_name: str
    policy_holder_city: str
    policy_holder_state: str
    policy_holder_zip: int
    policy_holder_country: str
    policy_holder_mobile: str
    policy_holder_email: str
    policy_holder_occupation: str
    policy_holder_ssn: Optional[str]
    policy_from_channel: Optional[str]
    policy_associated_ic_id: Optional[str]


class PropertyInfo(BaseModel):
    residenceType: str
    constructionType: str
    yearBuilt: int
    numberOfStories: int
    squareFootage: int
    heatingType: str
    plumbing_installed_year: int
    wiring_installed_year: int
    heating_installed_year: int
    roof_installed_year: int
    fireHydrantDistance: float
    fireStationDistance: float
    alternateHeating: str
    any_business_conducted_on_premises: str
    trampolineRamp: str
    subjectToFlood: str
    floodInsuranceRequested: str
    rentedToOthers: str
    CoverageLocation_street_number: int
    CoverageLocation_street_name: str
    CoverageLocation_city: str
    CoverageLocation_state: str
    CoverageLocation_zip: int
    CoverageLocation_country: str
    additionalInfo: Optional[str]


class AdditionalInfo(BaseModel):
    currentInsuranceCarrier: str
    currentPolicy: str
    effectiveDate: str
    current_policy_premium: float
    anyLossLast4Years: str
    mortgageeName: str
    mortgageeStreetNumber: Optional[str]
    mortgageeStreetName: Optional[str]
    mortgageeCity: Optional[str]
    mortgageeState: Optional[str]
    mortgageeCountry: Optional[str]
    mortgageeZip: Optional[str]
    mortgageeInstallmentAmount: float


class Coverages(BaseModel):
    dwellingCoverage: float
    personalProperty: float
    personalLiabilityCoverage: float
    medicalPayments: float
    deductible: float


class Details_to_extract:

    @classmethod
    def claim(cls):
        string = """
                policy_number: 
                claim_reported_by:
                loss_date_and_time:
                loss_type:
                street_number:
                street_name:
                loss_city:
                loss_state:
                loss_zip:
                loss_country:
                police_fire_contacted:
                report_number:
                loss_damage_description:
        
            """
        return string
    
    @classmethod
    def quote(cls):
        string = """
        PolicyInfo{
                 selectedPolicy:
                policy_holder_FirstName: 
                policy_holder_LastName: 
                policy_holder_street_number: 
                policy_holder_street_name: 
                policy_holder_city: 
                policy_holder_state: 
                policy_holder_zip: 
                policy_holder_country: 
                policy_holder_mobile: 
                policy_holder_email: 
                policy_holder_occupation: 
            }
        PropertyInfo{
                residenceType: 
                constructionType: 
                yearBuilt: 
                numberOfStories: 
                squareFootage: 
                heatingType: 
                plumbing_installed_year: 
                wiring_installed_year: 
                heating_installed_year: 
                roof_installed_year: 
                fireHydrantDistance: 
                fireStationDistance: 
                alternateHeating: 
                any_business_conducted_on_premises: 
                trampolineRamp: 
                subjectToFlood: 
                floodInsuranceRequested: 
                rentedToOthers: 
                CoverageLocation_street_number: 
                CoverageLocation_street_name: 
                CoverageLocation_city: 
                CoverageLocation_state: 
                CoverageLocation_zip: 
                CoverageLocation_country: 
            }
        AdditionalInfo{
                currentInsuranceCarrier:
                currentPolicy: 
                effectiveDate: 
                current_policy_premium: 
                anyLossLast4Years: 
                mortgageeName: 
                mortgageeInstallmentAmount: float
            }
        Coverages(BaseModel){
                dwellingCoverage: 
                personalProperty: 
                personalLiabilityCoverage:
                medicalPayments: 
                deductible: 
            }
                """
        return string
    

    @classmethod
    def medbill(cls):
        string = """
            patient_info{
                patient_name:
                patient_address:
                account_number:
            }

            guarantor_info{
                guarantor_name:
                guarantor_address:
                guarantor_number:
            }

            service_info{:
                hospital_address:
                service_doctor:
                statement_date:
                date_of_service:
                charges:
                payments_adjustments:
                insurance_payments_adjustments:
                patient_balance:
                billing_support_contact:
            }
                """
        return string
    
    @classmethod
    def lossruns(cls):
        string = """
        grand_totals{
                No_of_claims:
                Total_amount:
                Incurred_Claim_Amount:
                Total_Incurred_Medical_Losses:
                Total_Incurred_Expenses:
                Reserved_Amounts:
            }
        subtotals{
                policy_holder_name: 
                policy_numbers_list:
                sai_number:
                workers_comp_no_of_claims_list:
                workers_comp_total_amounts:
                workers_comp_reserved_amounts:
                products_liability_no_of_claims_list:
                products_liability_total_amounts:
                products_liability_reserved_amounts:
                auto_liability_no_of_claims_list:
                auto_liability_total_amounts:
                auto_liability_reserved_amounts:
                general_liability_no_of_claims_list:
                general_liability_total_amounts:
                general_liability_reserved_amounts:
                property_no_of_claims_list:
                property_total_amounts:
                property_reserved_amounts:
            }
                """
        return string

    @classmethod
    def idcard(cls):
        string = """
                IdCard{
                first_name:
                last_name:
                document_type:
                document_number:
                date_of_birth:
                expiration_date:
                address:
                Height:
                Eye_Color:
                Weight:
                Sex:
                issuance_date:
                endorsements:
                class_type:
                hair_color:
                restrictions:
                real_id:
                }
                """
        return string

    @classmethod
    def summary(cls):
        return "This is the summarized context of the extracted text, check whether the provided summary is matching with the extracted text from document. There will be no specific fields to extract just summarization is enough!"
