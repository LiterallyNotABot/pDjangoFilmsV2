from django.core.management.base import BaseCommand
from django.core.management import call_command
from io import StringIO
import sys

class Command(BaseCommand):
    help = "Rebuild all Elasticsearch indexes without manual prompts"

    def handle(self, *args, **options):
        self.stdout.write("Rebuilding Elasticsearch indexes...\n")

        targets = [
            "films.Film",
            "films.Person",
            "users.List",
            "users.UserProfile",
        ]

        for model in targets:
            self.stdout.write(f"Reindexing {model}...")

            sys.stdin = StringIO('y\n')
            call_command("search_index", "--models", model, "--rebuild")

        self.stdout.write(self.style.SUCCESS("All indexes rebuilt successfully."))
