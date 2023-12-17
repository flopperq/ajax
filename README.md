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
4) **Открытие в браузере**
Откройте index.html через браузер.