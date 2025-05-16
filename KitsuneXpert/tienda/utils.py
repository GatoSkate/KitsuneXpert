from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

def enviar_email_bienvenida(user):
    asunto = "¡Bienvenido a KitsuneXpert!"
    contexto = {'usuario': user}
    
    html_message = render_to_string('tienda/emails/bienvenida.html', contexto)
    plain_message = strip_tags(html_message)
    
    send_mail(
        asunto,
        plain_message,
        None,  # Usará DEFAULT_FROM_EMAIL
        [user.email],
        html_message=html_message
    )