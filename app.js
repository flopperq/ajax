$(document).ready(function () {
    var baseUrl = "http://localhost:3000"; // Базовый URL для локального сервера

    // Загрузка постов при открытии страницы
    loadPosts();

    // Открываем модальное окно при клике на кнопку создания поста
    $("#createPostButton").on("click", function () {
        openModal();
    });

    // Закрываем модальное окно при клике на крестик
    $(".close").on("click", function () {
        closeModal();
    });

    // Обработчик клика по кнопке внутри модального окна
    $("#submitButton").on("click", function () {
        submitForm();
    });

    function openModal() {
        $("#myModal").css("display", "block");
        loadUsers(); // Загружаем список пользователей
    }

    function closeModal() {
        $("#myModal").css("display", "none");
        $("#title").val("");
        $("#body").val("");
        $("#postForm").data("postId", ""); // Очищаем сохраненный postId
        updateFormMode("create");
    }

    function updateFormMode(mode) {
        let submitButton = $("#submitButton");

        if (mode === "create") {
            submitButton.text("Создать пост");
        } else if (mode === "edit") {
            submitButton.text("Сохранить изменения");
        }

        submitButton.off("click").on("click", function () {
            submitForm();
        });
    }

    function submitForm() {
        var title = $("#title").val();
        var body = $("#body").val();
        var userId = $("#selectUser").val(); // Получаем значение выбранного пользователя
        var postId = $("#postForm").data("postId");

        if (!postId) {
            // Создание нового поста
            $.post(`${baseUrl}/posts`, { title: title, body: body, userId: userId }, function () {
                loadPosts();
                closeModal();
            });
        } else {
            // Редактирование существующего поста
            updatePost(postId, userId);
        }
    }

    function loadPosts() {
        $("#postList").addClass("loading"); // Добавляем класс для отображения лоадера
        $.get(`${baseUrl}/posts`, function (posts) {
            displayPostsSorted(posts);
        }).always(function () {
            $("#postList").removeClass("loading"); // Удаляем класс после загрузки
        });
    }

    function displayPostsSorted(posts) {
        var postList = $("#postList");
        postList.empty();
    
        // Сортируем посты: важные посты в начале, затем обычные
        var importantPosts = [];
        var normalPosts = [];
    
        // Функция для получения информации о пользователе по его ID
        function getUserInfo(userId) {
            return $.get(`${baseUrl}/users/${userId}`);
        }
    
        // Асинхронная функция для обработки постов
        async function processPosts() {
            for (const post of posts) {
                // Получаем информацию о пользователе по ID
                const userInfo = await getUserInfo(post.userId);
    
                if (isPostImportant(post.id)) {
                    importantPosts.push({ post, userInfo });
                } else {
                    normalPosts.push({ post, userInfo });
                }
            }
    
            // Сортируем посты и отображаем их
            var sortedPosts = importantPosts.concat(normalPosts);
    
            sortedPosts.forEach(async function (postObj) {
                const post = postObj.post;
                const userInfo = postObj.userInfo;
    
                var listItem = $("<li>").html(`
                    <h3>${post.title}</h3>
                    <p>${post.body}</p>
                    <p>Создано пользователем: ${userInfo.name}</p>
                    <button class="editButton" data-post-id="${post.id}">Редактировать</button>
                    <button class="deleteButton" data-post-id="${post.id}">Удалить</button>
                    <button class="markImportantButton ${isPostImportant(post.id) ? 'marked' : ''}" data-post-id="${post.id}">Отметить важным</button>
                `);
    
                // Проверяем, является ли пост важным
                if (isPostImportant(post.id)) {
                    listItem.addClass("important-post");
                    listItem.find('.markImportantButton').html('★');
                }
    
                postList.append(listItem);
            });
    
            // Добавим обработчики событий для кнопок "Редактировать" и "Удалить"
            $(".editButton").on("click", function () {
                var postId = $(this).data("post-id");
                editPost(postId);
            });
    
            $(".deleteButton").on("click", function () {
                var postId = $(this).data("post-id");
                deletePost(postId);
            });
    
            $(".markImportantButton").on("click", function () {
                var postId = $(this).data("post-id");
                markPostAsImportant(postId);
            });
        }
    
        processPosts();
    }
    
    function isPostImportant(postId) {
        var importantPosts = JSON.parse(localStorage.getItem("importantPosts")) || [];
        return importantPosts.includes(postId);
    }

    function markPostAsImportant(postId) {
        var importantPosts = JSON.parse(localStorage.getItem("importantPosts")) || [];
    
        if (importantPosts.includes(postId)) {
            // Если пост уже важный, удаляем его из важных
            importantPosts = importantPosts.filter(id => id !== postId);
        } else {
            // Если пост не важный, добавляем его в важные
            importantPosts.push(postId);
        }
    
        localStorage.setItem("importantPosts", JSON.stringify(importantPosts));
    
        loadPosts(); // Перезагружаем посты после изменения важности
    }

    window.editPost = function (postId) {
        $.get(`${baseUrl}/posts/${postId}`, function (post) {
            $("#title").val(post.title);
            $("#body").val(post.body);
            $("#selectUser").val(post.userId); // Устанавливаем выбранного пользователя
            $("#postForm").data("postId", postId); // Сохраняем postId
            updateFormMode("edit");
            openModal();
        });
    };

    function updatePost(postId, userId) {
        var title = $("#title").val();
        var body = $("#body").val();

        $.ajax({
            method: "PUT",
            url: `${baseUrl}/posts/${postId}`,
            data: { title: title, body: body, userId: userId },
            success: function () {
                // После успешного обновления, загружаем посты и закрываем модальное окно
                loadPosts();
                closeModal();
            }
        });
    }

    window.deletePost = function (postId) {
        if (isPostImportant(postId)) {
            if (confirm("Вы уверены, что хотите удалить важный пост?")) {
                deletePostRequest(postId);
            }
        } else {
            deletePostRequest(postId);
        }
    };

    function deletePostRequest(postId) {
        $.ajax({
            method: "DELETE",
            url: `${baseUrl}/posts/${postId}`,
            success: function () {
                loadPosts();
            }
        });
    }

    function loadUsers() {
        $.get(`${baseUrl}/users`, function (users) {
            var selectUser = $("#selectUser");
            selectUser.empty();

            users.forEach(function (user) {
                var option = $("<option>").attr("value", user.id).text(user.name);
                selectUser.append(option);
            });
        });
    }
});
