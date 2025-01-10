from django.urls import path
from . import views

urlpatterns = [
    path('process_file/', views.IDP, name='IDP'),
    path('add-idp-claim/', views.add_idp_claim_details, name='add_idp_claim'),
    path('Welcome_Chat_agent/', views.Welcome_Chat_agent, name='Welcome_Chat_agent'),
    path('AI_CHAT_AGENT/', views.AI_CHAT_AGENT, name='InsurAI'),
    path('trigger_email_parsing/', views.trigger_email_parsing, name='trigger_email_parsing'),
    path('process_emails/', views.process_emails, name='process_mails'),
    path('get_document_by_email/', views.get_document_by_email, name='get_pdf_by_email'),
    path('email_to_fnol_edit/', views.email_to_fnol_edit, name='email_to_fnol_edit'),
    path('get_chat_history/', views.get_chat_history, name='chat_history'),
    path('id_card_extraction/', views.id_card_extraction, name='id_card_extraction'),
    path('docai_sov', views.docai_sov, name='docai_sov'),
    path('parse_text/', views.parse_text, name='parse_text'),
    path('process_files/', views.process_files, name='process_files'),
    path('process_medbill/', views.process_medbill, name='process_medbill'),
    path('process_docaiclassify_files/', views.process_docaiclassify_files, name='process_docaiclassify_files'),
    path('edit_update_docai_classify_document/', views.edit_update_docai_classify_document, name='edit_update_docai_classify_document'),
    path('docai_summary/', views.docai_summary, name='docai_summary'),
]