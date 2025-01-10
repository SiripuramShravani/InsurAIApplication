from django.urls import path
from . import views

urlpatterns = [
    path('DocAI_Batch_Quote/', views.DocAI_Batch_Quote, name='DocAI_Batch_Quote'),
    path('fetch_docai_batch_quote/', views.fetch_docai_batch_quote, name='fetch_docai_batch_quote'),
    path('get_batch_quote_document/', views.get_batch_quote_document, name='get_batch_quote_document'),
    path('edit_docai_batch_quote_failure/', views.edit_docai_batch_quote_failure, name='edit_docai_batch_quote_failure'),
    path('Trigger_DocAI_Classify/', views.Trigger_DocAI_Classify, name='Trigger_DocAI_Classify'), 
]

