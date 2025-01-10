from django.urls import path
from . import views

urlpatterns = [
    path('policy_creation/', views.policy_creation, name='policy_creation'),
    path('idp_policy_intake/', views.idp_policy_intake, name='idp_policy_intake'),
    path('trigger_email_parsing/', views.trigger_email_parsing, name='trigger_email_parsing'),
    path('process_emails/', views.process_emails, name='process_mails'),
    path('get_document_by_email/', views.get_document_by_email, name='get_pdf_by_email'),
    path('email_to_policy_edit/', views.email_to_policy_edit, name='email_to_policy_edit'),
    path('get_quotes_by_channel/', views.get_quotes_by_channel, name='get_quotes_by_channel'),
    path('get_docai_process_document/', views.get_docai_process_document, name='get_docai_process_document'),
    path('get_mail2quote_quotes/', views.get_mail2quote_quotes, name='get_mail2quote_quotes'),
    path('get_mail2quote_process_document/', views.get_mail2quote_process_document, name='get_mail2quote_process_document'),
    path('get_document_extracteddata_by_mail2quote_email/', views.get_document_extracteddata_by_mail2quote_email, name='get_document_extracteddata_by_mail2quote_email'),
]