/**
 * jQuery.simpleSlider - Very simple jQuery slider plugin
 * 
 * Copyright (c) 2022 by MAMEDUL ISLAM (https://mamedul.github.io/)
 *
 * Licensed under the MIT license:
 *   https://opensource.org/licenses/MIT
 *
 * Project home:
 *   https://mamedul.gitlab.io/dev-projects/jquery-simpleslider
 * 
 * Version: 1.0.0
 */
(function($) {

    "use strict";

    if ($.fn && $.fn.jquery) {

        
        $.fn.simpleSlider = function(options) {
			
            /*
            $.event.special.touchstart = {
                setup: function( _, ns, handle ) {
                    this.addEventListener("touchstart", handle, { passive: !ns.includes("noPreventDefault") });
                }
            };
            $.event.special.touchmove = {
                setup: function( _, ns, handle ) {
                    this.addEventListener("touchmove", handle, { passive: !ns.includes("noPreventDefault") });
                }
            };
            $.event.special.wheel = {
                setup: function( _, ns, handle ){
                    this.addEventListener("wheel", handle, { passive: true });
                }
            };
            $.event.special.mousewheel = {
                setup: function( _, ns, handle ){
                    this.addEventListener("mousewheel", handle, { passive: true });
                }
            };
            */

            var opts = {
                'duration': 20,
                'amount': 1,
                'position': 0,
                'multiplier': 2,
                'movable': true,
            };

            var fnc = function(selector) {

                var opt = $.extend(opts, options) || opts;
                opt = $.extend(opt, {
                    'selector': selector
                }) || opt;

                var scroll = opt;

                var $gallery = $(selector);
                var $gallery_parent = $gallery.parent();
                var $gallery_items = $gallery.children();

                // var matchesZ = transform.match(/translateX\(([^)]+)\)/); //matchesZ[1]
                // var matchesZ = transform.match(/translate\(([^)]+), ([^)]+)\)/); //matchesZ[1]

                if (scroll.movable) {

                    var moveEnded = true;
                    var movePosition = null;
                    var movePosition2 = null;

                    var preventDefault = function(e) {

                        if (e.cancelable) e.preventDefault();
                    };

                    var moveStart = function(e) {

                        moveEnded = false;

                        try {

                            if (e.cancelable) e.preventDefault();

                            if (typeof scroll.interval != 'undefined') {
                                clearInterval(scroll.interval);
                            }

                            movePosition = e.pageX || e.touches[0].clientX;

                            $gallery.css('transition-duration', '0ms');

                            if (typeof scroll.moveStart == 'function') {
                                scroll.moveStart(e);
                            }

                        } catch (err) {}

                    };

                    var moveRun = function(e) {

                        try {

                            if (e.cancelable && e.preventDefault) e.preventDefault();

                            if (!moveEnded) {

                                if (typeof scroll.moveRun == 'function') {
                                    scroll.moveRun(e);
                                }

                                movePosition2 = e.pageX || e.touches[0].clientX;

                                $gallery.css('transform', 'translateX(' + (scroll.position + (movePosition2 - movePosition)) + 'px)');
                                $gallery.attr('data-position', scroll.position);
                                $gallery.data('position', scroll.position);

                            }

                        } catch (err) {}

                    };

                    var moveEnd = function(e) {

                        moveEnded = true;

                        try {

                            if (e.cancelable) e.preventDefault();
                            var movePosition3 = e.pageX || movePosition2;
                            scroll.position = scroll.position + (movePosition3 - movePosition);

                            $gallery.css('transition-duration', (scroll.duration < 400 ? 400 : scroll.duration) + 'ms');
                            setTimeout(function() {
                                scroll.position = scroll.position > 56 ? 0 : (scroll.position < scroll.scrollableNegWidth ? scroll.scrollableNegWidth : scroll.position);
                                $gallery.attr('data-position', scroll.position);
                                $gallery.data('position', scroll.position);
                                $gallery.css('transform', 'translateX(' + (scroll.position) + 'px)');
                                if (typeof scroll.init != 'undefined') {
                                    scroll.init();
                                }
                            }, 100);

                            if (typeof scroll.moveEnd == 'function') {
                                scroll.moveEnd(e);
                            }

                            if (movePosition3 - movePosition != 0) {
                                $(e.target).on('click', preventDefault);
                                setTimeout(function() {
                                    $(e.target).off('click', preventDefault);
                                }, 200);
                            }

                        } catch (err) {}

                        movePosition = null;
                        movePosition2 = null;

                    };

                    //Mouse event
                    $gallery.on('mousedown', function(e) {

                        moveEnded = false;

                        if (e.cancelable) e.preventDefault();

                        moveStart(e);

                        //$(window).on('mousemove', moveRun);
                        $(document).on('mousemove', moveRun);

                        $(document).on('mouseup', function(e) {
                            $(document).off('mousemove', moveRun);
                            if (!moveEnded) moveEnd(e);
                            moveEnded = true;
                        });

                        $(window).on('mouseup', function(e) {
                            $(document).off('mousemove', moveRun);
                            if (!moveEnded) moveEnd(e);
                            moveEnded = true;
                        });

                    });

                    //Touch event
                    $gallery.on('touchstart', function(e) {

                        moveEnded = false;
                        try {
                            if (e.cancelable) e.preventDefault();
                        } catch (err) {}

                        moveStart(e);

                        //$(window).on('touchmove', moveRun);
                        $(document).on('touchmove', moveRun);

                        $(document).on('touchcancel', function(e) {
                            $(document).off('touchmove', moveRun);
                            if (!moveEnded) moveEnd(e);
                        });

                        $(window).on('touchcancel', function(e) {
                            $(document).off('touchmove', moveRun);
                            if (!moveEnded) moveEnd(e);
                        });

                        $(document).on('touchend', function(e) {
                            $(document).off('touchmove', moveRun);
                            if (!moveEnded) moveEnd(e);
                        });

                    });

                }

                scroll.init = function() {

                    var _this = this;
                    $gallery = $(selector);
                    $gallery_parent = $gallery.parent();
                    $gallery_items = $gallery.children();
                    //var gp_width = $gallery_parent.innerWidth() || $gallery_wrapper.innerWidth();
                    var gp_width = $gallery_parent.innerWidth();
                    var gi_width = 0;
                    $gallery_items.each(function(index, item) {
                        gi_width += $(this).outerWidth(true);
                    });

                    if (gp_width * this.multiplier > gi_width) {
                        var tg_width = gp_width * this.multiplier;
                        var tg_widthMultiplier = Math.ceil(tg_width / gi_width);
                        var _this = null;
                        for (var i = 0; tg_widthMultiplier > i; i++) {
                            $gallery_items.each(function(index, item) {
                                $(this || item).clone().attr('data-cloned', 'true').appendTo($gallery);
                            });
                        }
                        gp_width = $gallery_parent.innerWidth();
                        gi_width = 0;
                        $gallery_items = $gallery.children();
                        $gallery_items.each(function(index, item) {
                            gi_width += $(this).outerWidth(true);
                        });
                    }

                    this.scrollWidth = gi_width;
                    this.width = gp_width;
                    this.scrollableWidth = gi_width - gp_width;
                    //this.scrollableWidth = gi_width;
                    this.scrollableNegWidth = this.scrollableWidth * -1;

                    $gallery.attr('scrollable', this.scrollableWidth);
                    $gallery.data('scrollable', this.scrollableWidth);
                    $gallery.attr('data-width', this.width);
                    $gallery.data('width', this.scrollWidth);
                    $gallery.css('width', this.scrollWidth + 'px');
                    $gallery_parent.attr('data-width', this.width);
                    $gallery_parent.data('width', this.width);

                    this.interval = setInterval(function() {

                        scroll.side = $gallery.data('side') || false;

                        if (typeof $gallery.data('side') == 'undefined') {
                            $gallery.attr('data-side', scroll.side);
                            $gallery.data('side', scroll.side);
                        }

                        scroll.side = (scroll.side == 'true' ? true : (scroll.side == 'false' ? false : scroll.side));
                        scroll.position = $gallery.data('position') || scroll.position || 0;
                        scroll.position = scroll.side ? scroll.position + scroll.amount : scroll.position - scroll.amount;
                        $gallery.css('transform', 'translateX(' + (scroll.position) + 'px)');
                        $gallery.attr('data-position', scroll.position);
                        $gallery.data('position', scroll.position);
                        $gallery.attr('data-side', scroll.side);
                        $gallery.data('side', scroll.side);

                        if (scroll.position > 0) {
                            $gallery.attr('data-side', false);
                            $gallery.data('side', false);
                        }

                        if (scroll.position < scroll.scrollableNegWidth) {
                            $gallery.attr('data-side', true);
                            $gallery.data('side', true);
                        }

                    }, this.duration || 50);

                    //clearInterval( this.interval );

                };

                var resizer = function() {
                    $(window).off('resize', resizer);
                    clearInterval(scroll.interval);
                    scroll.init();
                };

                $(window).on('resize', resizer);

                $(scroll.selector).css('transition-property', 'transform');
                $(scroll.selector).css('transition-duration', (scroll.duration < 400 ? 400 : scroll.duration) + 'ms');
                $(scroll.selector).css('transition-timing-function', 'ease');

                scroll.init();

            };

            ((this.fn && this.fn.jquery) ? this : $(this)).each(function(index, item) {
                fnc(this || item);
                return this || item;
            });

            ((this.fn && this.fn.jquery) ? this : $(this)).pluginBy = 'MAMEDUL ISLAM';

            return ((this.fn && this.fn.jquery) ? this : $(this));

        }

    } else {

        console.log("%cWarning: %s", 'color:#e4672e;font-size:200%;', 'Need jQuery');

    }

})(jQuery || {});