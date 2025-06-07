import subprocess
import os

def run_elasticsearch():
    compose_file = os.path.join(os.path.dirname(__file__), "docker-compose.yml")
    subprocess.run(["docker-compose", "-f", compose_file, "up", "--build"])

if __name__ == "__main__":
    run_elasticsearch()
