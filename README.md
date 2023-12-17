# ajax post viewer
Приложение позволяет создавать посты, редактировать, удалять, отмечать важные посты, а также указывать автора поста.

## Локальная сборка и запуск
Следуйте инструкциям ниже, чтобы локально запустить приложение:
### Требования:
- Node.js (https://nodejs.org/)
- npm (Node Package Manager, поставляется с Node.js)
### Шаги:
1) **Клонирование репозитория:**
```bash
git clone https://github.com/flopperq/ajax
```
2) **Установка зависимостей:**
```bash
npm install
npm install jquery
npm install -g json-server
```
3) **Запуск сервера:**
```bash
json-server --watch db.json
```
4) **Открытие в браузере:**

Откройте index.html через браузер.

## Скриншоты
### Скриншот ленты постов
![image](https://github.com/flopperq/ajax/assets/91046873/90fd85b8-83b7-4b6a-b0cd-fdbdf7a51c8b)
### Диалоговое окно (добавление/редактирование)
![image](https://github.com/flopperq/ajax/assets/91046873/8c0289c7-4781-4200-ae78-59a648d79452)
### Выпадающий список авторов
![image](https://github.com/flopperq/ajax/assets/91046873/a1044f16-3497-492e-b20d-f5cfc83b541d)
### Подтверждение удаления важного поста
![image](https://github.com/flopperq/ajax/assets/91046873/c4d182a4-7130-4ae6-afa9-cee36e3326be)




