from django.urls import path
from . import views

urlpatterns = [
    path('add-claim/', views.add_claim_details, name='add_claim'),
    path('add-company/', views.add_company_details, name='add_company'),
    path('get-location/', views.get_address, name='get-location'),
    path('get-company-names/', views.get_all_company_names, name='get_company_names'),
    path('get-company-by-name/', views.get_company_by_name, name='get_company_by_name'),
    path('get-company-by-id/', views.get_company_by_id, name='get_company_by_id'),
    path('update-company/', views.update_company_by_id, name='update_company'),
    path('get-policy/', views.get_policy_details, name='get_policy'),
    path('verify_noninsured_email/',views.verify_noninsured_email, name='verify_noninsured_email'),
    path('verify-otp/', views.verify_otp_view, name='verify_otp'),
    path('verify-policy/', views.verify_policy_number, name='verify_policy'),
    path('get_all_details/', views.get_all_details, name='get_all_details'),
    path('get_all_policy_details/', views.get_all_policy_details, name='get_all_policy_details'),
    path('get_all_claims_details/', views.get_all_claims_details, name='get_all_claims_details'),
    path('get_all_channels_claims/', views.get_all_channels_claims, name='get_all_channels_claims'),
    path('get_email_to_fnol_claims/', views.get_email_to_fnol_claims, name='get_email_to_fnol_claims'),
    path('get_agents_details/', views.get_agents_details, name='get_agents_details'),
    path('get_agent_stats/', views.get_agent_stats, name='get_agent_stats'),
    path('get_all_reports/', views.get_all_reports, name='get_all_reports'),
    path('send_verification_for_demo/', views.send_verification_for_demo, name='send_verification_for_demo'),
    path('verify_otp_and_add_demo/', views.verify_otp_and_add_demo, name='verify_otp_and_add_demo'),
    path('validate_address/', views.validate_address, name='validate_address'),
    path('get_idp_process_documents/', views.get_idp_process_documents, name='get_idp_process_documents'),
    path('get_email_to_fnol_documents/', views.get_email_to_fnol_documents, name='get_email_to_fnol_documents'),
    path('update_agent_details/', views.update_agent_details, name='update_agent_details'),
    path('get_ic_id_for_company_Admin/', views.get_ic_id_for_company_Admin, name='get_ic_id_for_company_Admin'),
    path('get_ic_email_by_ic_name/', views.get_ic_email_by_ic_name, name='get_ic_email_by_ic_name')
]   