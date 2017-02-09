define(["dojo/_base/declare",
        "dojo/_base/array",
        "dojo/dom-construct",
        "dojox/mobile/ListItem",
        "dojox/mobile/EdgeToEdgeStoreList",
        'dojox/mobile/ScrollableView',
        "nba-player-stats/config/appConfig",
        "dojo/i18n!nba-player-stats/nls/leaders"],
    function (declare, array, domConstruct, ListItem, EdgeToEdgeStoreList, ScrollableView, appConfig, nls) {
        var MenuListItem = declare(ListItem, {
            clickable: true
        });

        return {

            beforeActivate: function () {
                var _t = this;
                this.config = appConfig[appConfig.selectedCustomer];
                //Set Header
                this.setHeader();

                array.forEach(this.config.categories, function (category) {
                    var menuItem = new MenuListItem()
                    menuItem.labelNode.style.height = '0px';
                    var divLabel = domConstruct.create("div", {
                        className: "nbaPlayerStatsMenuItem",
                        layout: "left"
                    }, menuItem.domNode);
                    divLabel.innerHTML = category.label;
                    menuItem.target = 'categories';

                    var params = {
                        category: category.value
                    }
                    params.category = encodeURIComponent(category.value);
                    params.categoryLabel = encodeURIComponent(category.label);
                    menuItem.transitionOptions = {params: params};

                    _t.categories.addChild(menuItem);

                });
                window.scrollTo(0, 0);

            },

            setHeader: function () {
                var icon;
                array.forEach(this.config.mainMenu, function (item) {
                    if (item.target == 'leaders') {
                        icon = item.icon;
                    }
                })
                this.leadersHeading.set('label', '<span class="' + icon + ' nbaPlayerStatsHeaderIcon"></span>&nbsp;' + nls.leadersHeader);
                this.leadersHeading.domNode.style.backgroundColor = this.config.header.headerColor;
            },

            beforeDeactivate: function () {
                var _t = this;
                if (this.categories.getChildren().length != 0) {
                    var children = this.categories.getChildren();
                    array.forEach(children, function (child) {
                        _t.categories.removeChild(child);
                    })
                }
            }

        };
    }
);

