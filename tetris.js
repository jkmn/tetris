;"use strict";

(function($){






    var tertis = function(){

        var tretisItemList = [],
            isStart = false;

        createDream();
        //创建画布
        function createDream(){

            var nX = 11, nY = 22;
            var $_wrap = $("<div/>");
            $_wrap.css({
                 width: 220,
                 height: 440,
                 border: "1px solid #000",
                 margin: "20px auto",
                 overflow: "hidden"
            })

            $('body').append($_wrap);


            for (var i = 0; i < nY; i++)
            {
                for (var j = 0; j < nX; j++)
                {
                    var item = new tertisItem(j, i)
                    addItem(item);
                    $_wrap.append(item.getBox());
                }
            }
        }

        function addItem (item)
        {
            if (typeof tretisItemList[item.getY()] === 'undefined') tretisItemList[item.getY()] = [];
            tretisItemList[item.getY()][item.getX()] = item;
        }

        this.getItem = function(x, y) {
            if (typeof tretisItemList[y] == 'undefined' || typeof tretisItemList[y][x] == 'undefined') return false;
            return tretisItemList[y][x]
        }

        this.getItems = function(){
            return tretisItemList;
        }

        this.existsItem = function(x, y)
        {
            if (typeof tretisItemList[y] == 'undefined' || typeof tretisItemList[y][x] == 'undefined') return false;
            return (tretisItemList[y][x]).isOpen();
        }

        this.createMove = function() {
            var aS = [0,1,2,3,4];
            var index = aS[Math.floor(Math.random() * aS.length)],
                box = null;

            switch(index) {
                case 0:
                    box = new boxType3(this);
                break;
                case 1:
                    box = new boxType3(this);
                break;
                case 2:
                    box = new boxType3(this);
                break;
                case 3:
                    box = new boxType3(this);
                    break;
                case 4:
                    box = new boxType3(this);
                break;
            }

            box.create();


        }

        this.remove = function() {


            for (var y = 21; y >= 0 ; y--) {

                var n = 0;

                for (var x = 10; x >= 0; x --)
                {
                    if (this.existsItem(x, y)) n++;
                }
                if (n == 11) {
                    for (var x = 10; x >= 0; x --)
                    {
                        (this.getItem(x, y)).close();
                    }
                    this.fill(y);
                    this.remove();
                }

            }

        }

        this.fill = function(startY){
            for (var y = startY; y >= 0; y--) {
                for (var x = 0; x < 11; x++) {
                    if (this.existsItem(x, y-1)) {
                         (this.getItem(x, y)).open();
                         (this.getItem(x, y-1)).close();
                    }
                }
            }
        }


    }


    var tertisItem = function(x, y) {


        var  bgColor = "#ccc";
        this.bIsOpen = false;

        var $_box = $("<div/>");

        $_box.css({
            backgroundColor: "#fff",
            width: 20,
            height: 20,
            float: "left"
        })

        this.getBox = function(){
            return $_box;
        }

        this.getX = function() {
            return x;
        }
        this.getY = function() {
            return y;
        }
        this.isOpen = function(){
            return this.bIsOpen;
        }

        this.open = function(){
            this.bIsOpen = true;
            $_box.css("backgroundColor", bgColor);
        }
        this.close = function(){
            this.bIsOpen = false;
            $_box.css("backgroundColor", '#fff');
        }



    }



    var boxType = function(tertis){

        var aTypes = ['down', 'right', 'up', 'left'],
            sType = aTypes[0], _this = this, timer = null, isStop = false;
        this.isChange = true; //是否可以改变
        this.aItems = [];
        this.oldItems = [];
        this.startX = 5;
        this.startY = 0;
        this.maxX = 0;
        this.minX = 0;
        this.maxY = 0;
        this.isChange = function(){
            return isChange;
        }
        this.getType = function(){
            return sType;
        }

        this.getItems = function(){
            return aItems;
        }
        this.getItems = function(item){
            // if (typeof aItems[item.getY()] =

        }

        this.create = function(){
            this.down();
            this.startMove();
        }

        this.copyOldItems = function()
        {
            this.oldItems = [];

            $.each(this.aItems, function(i) {
                _this.oldItems[i] = _this.aItems[i];
            })
        }

        this.openItems = function() {

            $.each(this.aItems, function(i) {
                if (tertis.getItem(_this.aItems[i][0], _this.aItems[i][1])) {
                    tertis.getItem(_this.aItems[i][0], _this.aItems[i][1]).open();
                }
            })
        }
        this.closeItems = function(){

            $.each(this.oldItems, function(i) {

                if (tertis.getItem(_this.oldItems[i][0], _this.oldItems[i][1])) {
                    tertis.getItem(_this.oldItems[i][0], _this.oldItems[i][1]).close();
                }
            })
        }



        this.startMove = function(){

            timer = setInterval(function(){
                if (isStop == true) {
                    clearInterval(timer);
                    $(document).unbind('keydown');
                    tertis.remove();
                    tertis.createMove();
                } else {
                    _this.moveDown();
                }


            }, 200)
        }

        $(document).bind('keydown', function(event) {
            event = event || window.event;

            switch(event.keyCode) {
                case 37:

                    _this.moveLeft();
                break;
                case 39:
                    _this.moveRight();
                break;
                case 38:
                if (isStop) return false;
                    _this.changeType();
                break;

            }
        })

        this.changeType = function() {
            if (!this.isChange) return false;
            var index = aTypes.indexOf(sType);
            if (++index >= 4) index = 0;
            sType = aTypes[index];
            if (!this[sType]()) {
                 if (--index < 0) index = 3;
                 sType = aTypes[index];
            }

        }

        this.moveDown = function(){
            if (this.maxY == 21) {
                isStop = true;
                return false;
            }


            this.copyOldItems();
            this.closeItems();


            $.each(this.aItems, function(i) {
                var item = _this.aItems[i],
                    y = item[1],
                    stop = false,
                    x = item[0];

                $.each(_this.aItems, function(j) {
                    if (x == _this.aItems[j][0] && _this.aItems[j][1] == y + 1){

                         stop = true;
                    }

                })

                if (stop == false) {
                    if (tertis.getItem(x, y+1) && tertis.existsItem(x, y +1 )) {

                        isStop = true;
                        return;
                    }
                }

            })

            if (!isStop)
            {
                $.each(this.aItems, function(i) {
                     _this.aItems[i][1] += 1;
                })
                this.maxY++;

            }
            this.openItems();



        }
        this.moveLeft = function(){
            if (this.minX == 0) return false;

              var hasLeft = false;
             $.each(this.aItems, function(i) {
                var item = _this.aItems[i],
                    y = item[1],
                    stop = false,
                    x = item[0];

                $.each(_this.aItems, function(j) {
                    if (x - 1 == _this.aItems[j][0]){

                         stop = true;
                    }

                })
                if (stop == false) {

                    if (tertis.existsItem(x - 1, y  )) {
                        hasLeft = true;
                        return;
                    }
                }

            })
            if (hasLeft) return false;

            this.copyOldItems();
            this.closeItems();
            $.each(this.aItems, function(i) {
                _this.aItems[i][0] -= 1;
            })
            this.minX--;
            this.maxX--;
            this.openItems();

        }
        this.moveRight = function(){

             if (this.maxX == 10) return false;

             var hasRight = false;
             $.each(this.aItems, function(i) {
                var item = _this.aItems[i],
                    y = item[1],
                    stop = false,
                    x = item[0];

                $.each(_this.aItems, function(j) {
                    if (x + 1 == _this.aItems[j][0]){

                         stop = true;
                    }

                })
                if (stop == false) {

                    if (tertis.existsItem(x +1, y  )) {
                        hasRight = true;
                        return;
                    }
                }

            })
            if (hasRight) return false;

            this.copyOldItems();
            this.closeItems();

            $.each(this.aItems, function(i) {
                _this.aItems[i][0] += 1;
            })
            this.maxX++;
            this.minX++;
            this.openItems();
        }


    }

    /**
     *
     *          ***
     *           *
     * @param  {[type]} tertis [description]
     * @return {[type]}        [description]
     */
    var boxType1 = function(tertis)
    {

        boxType.call(this, tertis);
        var startX = this.startX;
        var startY = this.startY;

        this.down = function(){



            if (!!!this.aItems.length) {
                this.aItems[0] =  [startX - 1, -1];
                this.aItems[1] = [startX, -1];
                this.aItems[2] = [startX+1, -1];
                this.aItems[3] = [startX, 0];
            } else {
                if (this.maxX == 10) return false;
                this.copyOldItems();
                this.aItems[0] = [this.aItems[3][0] , this.aItems[3][1]];
                this.aItems[3] = [this.aItems[2][0] , this.aItems[2][1]];
                this.aItems[2] = [this.aItems[2][0] + 1, this.aItems[2][1] - 1];
            }
            this.maxX = this.aItems[2][0];
            this.minX = this.aItems[0][0];
            this.maxY = this.aItems[3][1];
            this.closeItems();
            this.openItems();
            return true;
        }
        this.right = function(){
            this.copyOldItems();
            this.aItems[0] = [this.aItems[0][0] + 1, this.aItems[0][1] - 1];
            this.maxX = this.aItems[2][0];
            this.minX = this.aItems[3][0];
            this.maxY = this.aItems[3][1];
            this.closeItems();
            this.openItems();
            return true;
        }
        this.up = function(){
            if (this.minX == 0) return false;

            this.copyOldItems();
            // this.aItems[0] = [this.aItems[0][0] - 1, this.aItems[0][1] + 1];
            this.aItems[3] = [this.aItems[3][0] -1, this.aItems[3][1] - 1];
            this.maxX = this.aItems[2][0];
            this.minX = this.aItems[3][0];
            this.maxY = this.aItems[3][1];
            this.closeItems();
            this.openItems();
            return true;
        }
        this.left = function(){
            this.copyOldItems();
            this.aItems[2] = [this.aItems[2][0] - 1, this.aItems[2][1] + 1];
            this.maxX = this.aItems[2][0];
            this.minX = this.aItems[3][0];
            this.maxY = this.aItems[2][1];
            this.closeItems();
            this.openItems();
            return true;

        }

    }

    /**
     * **
     *  **
     * @param  {[type]} tertis [description]
     * @return {[type]}        [description]
     */
     var boxType2 = function(tertis)
    {

        boxType.call(this, tertis);
        var startX = this.startX;
        var startY = this.startY;

         this.left = this.right = this.up = this.down = function(){
            if (!!!this.aItems.length) {
                console.log(1)
                this.aItems[0] =  [startX - 1, -1];
                this.aItems[1] = [startX, -1];
                this.aItems[2] = [startX -1, 0];
                this.aItems[3] = [startX, 0];
            }
            this.maxX = this.aItems[1][0];
            this.minX = this.aItems[0][0];
            this.maxY = this.aItems[2][1];
        }

    }

     /**
     * **
     *  **
     * @param  {[type]} tertis [description]
     * @return {[type]}        [description]
     */
     var boxType3 = function(tertis)
    {

        boxType.call(this, tertis);
        var startX = this.startX;
        var startY = this.startY;

        this.down = function(){
            if (!!!this.aItems.length) {

                this.aItems[0] =  [startX - 1, -1];
                this.aItems[1] = [startX, -1];
                this.aItems[2] = [startX , 0];
                this.aItems[3] = [startX +1, 0];
            } else {
                this.copyOldItems();
                this.aItems[0] = [this.aItems[0][0] - 2, this.aItems[0][1] ];
                this.aItems[1] = [this.aItems[1][0] -1, this.aItems[1][1] -1];
                // this.aItems[2] = [this.aItems[2][0] , this.aItems[2][1]+1];
                this.aItems[3] = [this.aItems[3][0] +1, this.aItems[3][1] -1 ];
            }

            this.maxX = this.aItems[3][0];
            this.minX = this.aItems[0][0];
            this.maxY = this.aItems[2][1];
            this.closeItems();
            this.openItems();
            return true;

        }

        this.right = function(){

            this.copyOldItems();
            // this.aItems[0] = [this.aItems[0][0] - 1, this.aItems[0][1] + 1];
            this.aItems[0] = [this.aItems[0][0] +1, this.aItems[0][1]];
            this.aItems[1] = [this.aItems[1][0] , this.aItems[1][1] +1];
            this.aItems[2] = [this.aItems[2][0] +1, this.aItems[2][1]];
            this.aItems[3] = [this.aItems[3][0], this.aItems[3][1] + 1];
            this.maxX = this.aItems[2][0];
            this.minX = this.aItems[0][0];
            this.maxY = this.aItems[3][1];
            this.closeItems();
            this.openItems();
            return true;

        }

        this.up = function(){

            this.copyOldItems();
            this.aItems[0] = [this.aItems[0][0] +1 , this.aItems[0][1] +1 ]
            this.aItems[2] = [this.aItems[2][0] -1 , this.aItems[2][1] +1 ]
            this.aItems[3] = [this.aItems[3][0] -2 , this.aItems[3][1] ];

            this.maxX = this.aItems[1][0];
            this.minX = this.aItems[3][0];
            this.maxY = this.aItems[3][1];
            this.closeItems();
            this.openItems();
            return true;

        }

        this.left = function(){

            this.copyOldItems();
            this.aItems[0]= [this.aItems[0][0] -1 , this.aItems[0][1] - 1 ];
            // this.aItems[1] = [this.aItems[1][0] -2 , this.aItems[1][1] ];
            this.aItems[2] = [this.aItems[2][0] -1 , this.aItems[2][1] -1 ];
            this.maxX = this.aItems[2][0];
            this.minX = this.aItems[1][0];
            this.maxY = this.aItems[3][1];
            this.closeItems();
            this.openItems();
            return true;

        }

    }


     /**
     * **
     *  **
     * @param  {[type]} tertis [description]
     * @return {[type]}        [description]
     */
     var boxType4 = function(tertis)
    {

        boxType.call(this, tertis);
        var startX = this.startX;
        var startY = this.startY;

        this.down = this.up = function(){
            if (!!!this.aItems.length) {

                this.aItems[0] =  [startX , -3];
                this.aItems[1] = [startX,-2];
                this.aItems[2] = [startX , -1];
                this.aItems[3] = [startX, 0];
            } else {
                this.copyOldItems();
                this.aItems[0] =  [this.aItems[0][0] - 2 , this.aItems[0][1] - 2];
                this.aItems[1] =  [this.aItems[1][0] - 1 , this.aItems[1][1] - 1];
                this.aItems[3] =  [this.aItems[3][0] + 1 , this.aItems[3][1] + 1];
            }

            this.maxX = this.aItems[1][0];
            this.minX = this.aItems[1][0];
            this.maxY = this.aItems[3][1];
            this.closeItems();
            this.openItems();
            return true;

        }

         this.left = this.right = function() {
            this.copyOldItems();
            this.aItems[0] =  [this.aItems[0][0] + 2 , this.aItems[0][1] + 2];
            this.aItems[1] =  [this.aItems[1][0] + 1 , this.aItems[1][1] + 1];
            this.aItems[3] =  [this.aItems[3][0] - 1 , this.aItems[3][1] - 1];

            this.maxX = this.aItems[0][0];
            this.minX = this.aItems[3][0];
            this.maxY = this.aItems[3][1];
            this.closeItems();
            this.openItems();
            return true;
         }


    }


     /**
     * **
     *  **
     * @param  {[type]} tertis [description]
     * @return {[type]}        [description]
     */
     var boxType5 = function(tertis)
    {

        boxType.call(this, tertis);
        var startX = this.startX;
        var startY = this.startY;

        this.down = function(){
            if (!!!this.aItems.length) {

                this.aItems[0] =  [startX - 1, -2];
                this.aItems[1] = [startX, -2];
                this.aItems[2] = [startX , -1];
                this.aItems[3] = [startX, 0];
            } else {
                this.copyOldItems();
                this.aItems[1] = [this.aItems[1][0] + 1, this.aItems[1][1] -1];
                this.aItems[3] = [this.aItems[3][0] - 1, this.aItems[3][1] + 1];
            }

            this.maxX = this.aItems[3][0];
            this.minX = this.aItems[1][0];
            this.maxY = this.aItems[3][1];
            this.closeItems();
            this.openItems();
            return true;

        }

        this.right = function() {
            if (this.maxX == 10) return false;
            this.copyOldItems();
            this.aItems[0] = [this.aItems[0][0] + 2, this.aItems[0][1]];
            this.aItems[1] = [this.aItems[1][0] + 1, this.aItems[1][1] +1];
            this.aItems[3] = [this.aItems[3][0] - 1, this.aItems[3][1] -1];
            this.maxX = this.aItems[0][0];
            this.minX = this.aItems[3][0];
            this.maxY = this.aItems[3][1];
            this.closeItems();
            this.openItems();
            return true;
        }

        this.up = function() {

            this.copyOldItems();
            this.aItems[0] = [this.aItems[0][0] , this.aItems[0][1]];
            this.aItems[1] = [this.aItems[1][0] - 1, this.aItems[1][1] -1];
            this.aItems[3] = [this.aItems[3][0] + 1, this.aItems[3][1] + 1];
            this.maxX = this.aItems[0][0];
            this.minX = this.aItems[3][0];
            this.maxY = this.aItems[3][1];
            this.closeItems();
            this.openItems();
            return true;
        }

         this.left = function() {
            if (this.minX == 0) return false;
            this.copyOldItems();
            this.aItems[0] = [this.aItems[0][0] - 2, this.aItems[0][1]];
            this.aItems[1] = [this.aItems[1][0] - 1, this.aItems[1][1] +1];
            this.aItems[3] = [this.aItems[3][0] + 1, this.aItems[3][1] - 1];
            this.maxX = this.aItems[3][0];
            this.minX = this.aItems[0][0];
            this.maxY = this.aItems[3][1];
            this.closeItems();
            this.openItems();
            return true;
        }




    }







$(function(){

   var oTretis =  new tertis();
   oTretis.createMove();
})

})(jQuery)







