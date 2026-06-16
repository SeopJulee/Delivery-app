# 기말 프로젝트 Docker 구동 명령어 단축 Makefile

up:
	docker-compose up -d --build

down:
	docker-compose down

restart:
	docker-compose down
	docker-compose up -d --build

logs:
	docker-compose logs -f

db-shell:
	docker-compose exec db psql -U postgres -d delivery_app
