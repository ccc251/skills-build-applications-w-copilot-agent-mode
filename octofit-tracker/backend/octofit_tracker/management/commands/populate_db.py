from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from djongo import models

from octofit_tracker import models as octo_models

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Delete existing data
        self.stdout.write(self.style.WARNING('Deleting existing data...'))
        octo_models.Team.objects.all().delete()
        octo_models.Activity.objects.all().delete()
        octo_models.Leaderboard.objects.all().delete()
        octo_models.Workout.objects.all().delete()
        get_user_model().objects.all().delete()

        # Create teams
        marvel = octo_models.Team.objects.create(name='Marvel')
        dc = octo_models.Team.objects.create(name='DC')

        # Create users
        users = [
            {'email': 'ironman@marvel.com', 'username': 'ironman', 'team': marvel},
            {'email': 'captain@marvel.com', 'username': 'captain', 'team': marvel},
            {'email': 'batman@dc.com', 'username': 'batman', 'team': dc},
            {'email': 'superman@dc.com', 'username': 'superman', 'team': dc},
        ]
        user_objs = []
        for u in users:
            user = get_user_model().objects.create_user(email=u['email'], username=u['username'], password='test1234')
            user.team = u['team']
            user.save()
            user_objs.append(user)

        # Create activities
        for user in user_objs:
            for i in range(2):
                octo_models.Activity.objects.create(user=user, description=f"Workout {i+1} by {user.username}", duration=30+i*10)

        # Create workouts
        for user in user_objs:
            octo_models.Workout.objects.create(user=user, name=f"Workout for {user.username}", difficulty='Medium')

        # Create leaderboard
        for team in [marvel, dc]:
            octo_models.Leaderboard.objects.create(team=team, points=100 if team.name == 'Marvel' else 80)

        self.stdout.write(self.style.SUCCESS('Database populated with test data.'))
