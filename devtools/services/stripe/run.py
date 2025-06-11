import subprocess
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def run_stripe():
    compose_path = os.path.join(BASE_DIR, "docker-compose.yml")
    subprocess.run(
        ["docker-compose", "-f", compose_path, "up", "-d"],
        check=True
    )

if __name__ == "__main__":
    run_stripe()
