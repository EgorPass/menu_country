from django import forms
from django.forms import ModelForm
from web.models import Task
from django.db import models




class Interview_form(forms.ModelForm):
    class Meta:
        model = Task
        fields = ['country', 'regions_city']
        widgets = {
            'country': forms.TextInput(attrs={'class': 'style_task_form'}),
            'regions_city': forms.Textarea(attrs={'value': 123}),
        }
