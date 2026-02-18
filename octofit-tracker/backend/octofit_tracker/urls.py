"""octofit_tracker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""



from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from octofit_tracker import views as octo_views
from rest_framework.response import Response
from rest_framework.decorators import api_view
import os

@api_view(['GET'])
def api_root(request, format=None):
    codespace_name = os.environ.get('CODESPACE_NAME')
    if codespace_name:
        base_url = f'https://{codespace_name}-8000.app.github.dev/api/'
    else:
        scheme = 'https' if request.is_secure() else 'http'
        host = request.get_host()
        base_url = f'{scheme}://{host}/api/'
    return Response({
        'users': base_url + 'users/',
        'teams': base_url + 'teams/',
        'activities': base_url + 'activities/',
        'workouts': base_url + 'workouts/',
        'leaderboards': base_url + 'leaderboards/',
    })

router = routers.DefaultRouter()
router.register(r'users', octo_views.UserViewSet)
router.register(r'teams', octo_views.TeamViewSet)
router.register(r'activities', octo_views.ActivityViewSet)
router.register(r'workouts', octo_views.WorkoutViewSet)
router.register(r'leaderboards', octo_views.LeaderboardViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('', api_root, name='api-root'),
]



