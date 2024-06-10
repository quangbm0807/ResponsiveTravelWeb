var app = angular.module("myapp", ["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "trangchu.html",
            controller: "myCtrl"
        })
        .when("/gioithieu", {
            templateUrl: "gioithieu.html",
            controller: "myCtrl"
        })
        .when("/lienhe", {
            templateUrl: "lienhe.html",
            controller: "myCtrl"
        })
        .when("/detail/:id", {
            templateUrl: "chitiet.html",
            controller: "myCtrl"
        })
        .when("/dangnhap", {
            templateUrl: "dangnhap.html",
            controller: "LoginCtrl"
        })
        .when("/dangky", {
            templateUrl: "dangky.html",
            controller: "registerCtrl"
        })
        .when("/giohang", {
            templateUrl: "giohang.html",
            controller: "cartCtrl"
        })
        .when("/trongnuoc", {
            templateUrl: "trongnuoc.html",
            controller: "myCtrl"
        })
        .when("/ngoainuoc", {
            templateUrl: "ngoainuoc.html",
            controller: "myCtrl"
        })
        .when("/taikhoan/:id", {
            templateUrl: "taikhoan.html",
            controller: "AccountController",
            resolve: {
                "check": function ($location, $rootScope) {
                    if (!$rootScope.isLoggedIn) {
                        $location.path("/");
                    }
                }
            }
        })

        .otherwise({
            redirectTo: "/"
        });
});

app.controller('myCtrl', function ($scope, $routeParams, $http, CartService) {
    $scope.id = $routeParams.id;
    $scope.products = [];
    $scope.sort = 'price';
    $scope.currentPage = 1;
    $scope.pageSize = 6;

    $scope.tang = function () {
        $scope.sort = 'price';
    };

    $scope.giam = function () {
        $scope.sort = '-price';
    };

    $http.get("http://localhost:3000/products").then(function (response) {
        $scope.products = response.data;
        $scope.pageCount = Math.ceil($scope.products.length / $scope.pageSize);
        if ($scope.products.length > 0 && $routeParams.id) {
            $scope.detailPro = $scope.products.find(item => item.id == $routeParams.id);
        } else {
            console.log("404!");
        }
    });

    $scope.searchTour = function () {
        $scope.products = $scope.products.filter(function (tour) {
            return tour.title.toLowerCase().includes($scope.searchKeyword.toLowerCase());
        });
    };

    $scope.prev = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
        }
    };

    $scope.next = function () {
        if ($scope.currentPage < $scope.pageCount) {
            $scope.currentPage++;
        }
    };

    $scope.getPageNumbers = function () {
        var pages = [];
        for (var i = 1; i <= $scope.pageCount; i++) {
            pages.push(i);
        }
        return pages;
    };

    $scope.goToPage = function (pageNum) {
        $scope.currentPage = pageNum;
    };

    $scope.addToCart = function (product) {
        CartService.addToCart(product);
        alert('Thêm sản phẩm vào giỏ hàng thành công!');
    };
    $scope.selectedImageIndex = 0;
    $scope.changeImage = function (src, index) {
        var mainImage = document.getElementById('mainImage');
        mainImage.classList.add('fade-out');
        setTimeout(function () {
            mainImage.src = src;
            mainImage.classList.remove('fade-out');
        }, 300);
        $scope.selectedImageIndex = index;
    };

});

app.controller("LoginCtrl", function ($scope, $http, $location, $rootScope) {
    $scope.user = {};

    $scope.login = function () {
        $http.get("http://localhost:3000/users")
            .then(function (response) {
                var users = response.data;
                var foundUser = users.find(function (user) {
                    return user.email === $scope.user.email && user.password === $scope.user.password;
                });

                if (foundUser) {
                    alert("Đăng nhập thành công!");
                    $rootScope.currentUser = foundUser;
                    $rootScope.isLoggedIn = true;
                    $rootScope.$broadcast('userLoggedIn', foundUser.username);
                    sessionStorage.setItem('isLoggedIn', true);
                    sessionStorage.setItem('currentUser', JSON.stringify(foundUser));
                    $location.path('/taikhoan/' + foundUser.id);
                } else {
                    alert("Email hoặc mật khẩu không chính xác!");
                }
            })
            .catch(function (error) {
                console.error('Error fetching users:', error);
            });
    };
});


app.controller('AccountController', function ($scope, $http, $routeParams, $rootScope, $location, $route) {
    var userId = $routeParams.id;
    $scope.user = {};
    $scope.passwordData = {};

    function getUserData() {
        $http.get('http://localhost:3000/users/' + userId)
            .then(function (response) {
                $scope.user = response.data;
            })
            .catch(function (error) {
                console.error('Error fetching user data:', error);
            });
    }

    getUserData();

    $scope.updateProfile = function () {
        $http.put('http://localhost:3000/users/' + userId, $scope.user)
            .then(function (response) {
                alert('Cập nhật thông tin thành công!');
                $route.reload();
                $location.path('/taikhoan/' + userId);
            })
            .catch(function (error) {
                console.error('Error updating user info:', error);
            });
    };

    $scope.changePassword = function () {
        if ($scope.passwordData.newPassword !== $scope.passwordData.confirmNewPassword) {
            alert('Mật khẩu mới và xác nhận mật khẩu không khớp.');
            return;
        }

        $http.get('http://localhost:3000/users/' + userId)
            .then(function (response) {
                var user = response.data;

                if (user.password !== $scope.passwordData.currentPassword) {
                    alert('Mật khẩu hiện tại không đúng.');
                    return;
                }

                user.password = $scope.passwordData.newPassword;

                $http.put('http://localhost:3000/users/' + userId, user)
                    .then(function (response) {
                        alert('Đổi mật khẩu thành công!');
                        $scope.passwordData = {};
                    })
                    .catch(function (error) {
                        console.error('Error updating password:', error);
                    });
            })
            .catch(function (error) {
                console.error('Error fetching user data:', error);
            });
    };

    $scope.logout = function () {
        $rootScope.currentUser = null;
        console.log('User after logout:', $rootScope.currentUser);

        $rootScope.isLoggedIn = false;

        $location.path('/');
    };
});









app.controller("registerCtrl", function ($scope, $http) {
    $scope.users = [];
    function getUsers() {
        $http.get("http://localhost:3000/users")
            .then(function (response) {
                $scope.users = response.data;
            }, function (error) {
                console.error('Error fetching users:', error);
            });
    }

    getUsers();

    $scope.user = {};

    $scope.checkDuplicateEmail = function () {
        return $scope.users.some(function (user) {
            return user.email === $scope.user.email;
        });
    };

    $scope.checkDuplicatePhone = function () {
        return $scope.users.some(function (user) {
            return user.phone === $scope.user.phone;
        });
    };

    $scope.register = function () {
        if ($scope.checkDuplicateEmail()) {
            $scope.registrationForm.email.$setValidity("charE", false);
            return;
        } else {
            $scope.registrationForm.email.$setValidity("charE", true);
        }

        if ($scope.checkDuplicatePhone()) {
            $scope.registrationForm.phone.$setValidity("charE", false);
            return;
        } else {
            $scope.registrationForm.phone.$setValidity("charE", true);
        }

        var nextId = $scope.users.length + 1;
        $scope.user.id = "nextId";

        $http.post("http://localhost:3000/users", $scope.user).then(function (response) {
            $scope.user = {};
            $scope.confirmPassword = '';
            alert("Đăng ký thành công!");
            getUsers();
        }, function (error) {
            console.error('Đăng ký thất bại:', error);
        });
    };
});





app.factory('CartService', function ($rootScope) {
    var cart = JSON.parse(sessionStorage.getItem('cart')) || [];

    return {
        getCart: function () {
            return cart;
        },
        addToCart: function (product) {
            let existingProduct = cart.find(item => item.id === product.id);
            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                product.quantity = 1;
                cart.push(product);
            }
            sessionStorage.setItem('cart', JSON.stringify(cart));
            $rootScope.$broadcast('cartUpdated', cart);
            this.saveCartToStorage();
        },
        removeFromCart: function (product) {
            cart = cart.filter(item => item.id !== product.id);
            sessionStorage.setItem('cart', JSON.stringify(cart));
            $rootScope.$broadcast('cartUpdated', cart);
            this.saveCartToStorage();
        },
        getTotal: function () {
            return cart.reduce((total, product) => total + product.price * product.quantity, 0);
        },
        getCartLength: function () {
            return cart.reduce((total, product) => total + product.quantity, 0);
        },
        saveCartToStorage: function () {
            sessionStorage.setItem('cart', JSON.stringify(cart));
        }
    };
});



app.controller("cartCtrl", function ($scope, CartService) {
    $scope.cart = CartService.getCart();

    $scope.getTotal = function () {
        return CartService.getTotal();
    };
    $scope.removeFromCart = function (product) {
        CartService.removeFromCart(product);
        $scope.cart = CartService.getCart();
    };

    $scope.updateQuantity = function (product, amount) {
        let existingProduct = $scope.cart.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += amount;
            if (existingProduct.quantity <= 0) {
                $scope.removeFromCart(product);
            } else {
                sessionStorage.setItem('cart', JSON.stringify($scope.cart));
                $scope.$emit('cartUpdated', $scope.cart);
            }
        }
    };
});




app.controller("NavbarCtrl", function ($scope, $location, $window, $rootScope, CartService) {
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };

    $scope.cartLength = CartService.getCartLength();

    $scope.goToAccount = function () {
        if ($rootScope.currentUser && $rootScope.currentUser.id) {
            var userId = $rootScope.currentUser.id;
            $location.path('/taikhoan/' + userId);
        } else {
            alert("Người dùng chưa đăng nhập!");
        }
    };

    $rootScope.$on('userLoggedIn', function (event, username) {
        $scope.username = username;
    });

    $scope.cartLength = CartService.getCartLength();

    $scope.$on('$locationChangeSuccess', function () {
        $window.scrollTo(0, 0);
    });

    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        $rootScope.isLoggedIn = true;
        $rootScope.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        $scope.username = $rootScope.currentUser.username;
    } else {
        $rootScope.isLoggedIn = false;
        $rootScope.currentUser = null;
    }
});
app.controller("NavbarCtrl", function ($scope, $location, $window, $rootScope, CartService) {
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };

    $scope.cartLength = CartService.getCartLength();

    $scope.goToAccount = function () {
        if ($rootScope.currentUser && $rootScope.currentUser.id) {
            var userId = $rootScope.currentUser.id;
            $location.path('/taikhoan/' + userId);
        } else {
            alert("Người dùng chưa đăng nhập!");
        }
    };

    $rootScope.$on('userLoggedIn', function (event, username) {
        $scope.username = username;
    });

    $rootScope.$on('cartUpdated', function (event, newCart) {
        $scope.cartLength = CartService.getCartLength();
    });

    $scope.$on('$locationChangeSuccess', function () {
        $window.scrollTo(0, 0);
    });

    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        $rootScope.isLoggedIn = true;
        $rootScope.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        $scope.username = $rootScope.currentUser.username;
    } else {
        $rootScope.isLoggedIn = false;
        $rootScope.currentUser = null;
    }
});





