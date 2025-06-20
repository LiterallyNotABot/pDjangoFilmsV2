from django.core.management.base import BaseCommand
import sys
import importlib.util
import os
from pathlib import Path


class Command(BaseCommand):
    help = "Ejecuta el script data_importer.run() en un contexto Django cargado"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS("Iniciando importación de datos..."))

        # Ruta absoluta al archivo data_importer.py
        script_path = Path(__file__).resolve().parent.parent.parent / 'population_manager' / 'data_importer.py'

        # Carga el módulo de forma segura
        spec = importlib.util.spec_from_file_location("data_importer", script_path)
        module = importlib.util.module_from_spec(spec)
        sys.modules["data_importer"] = module
        spec.loader.exec_module(module)

        # Ejecuta la función run() del script
        if hasattr(module, "run"):
            module.run()
            self.stdout.write(self.style.SUCCESS("Importación completada."))
        else:
            self.stderr.write(self.style.ERROR("No se encontró la función run() en data_importer.py."))
