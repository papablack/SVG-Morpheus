(function ($) {

    $.SVGMorpheus = {
        options: function (options) {

            if (typeof options === 'undefined') {
                options = {};
            }

            var opts = {
                action: 'queue',
                scrollOptions: {}
            };

            return $.extend(opts, options);
        },
        instantize: function (element) {

            var $this = this;

            if (element.nodeName.toUpperCase() !== 'SVG') {
                element = element.getSVGDocument();
                element = element.getElementsByTagName('svg')[0];
            }

            var elementIds = [];

            for (var i = 0; i <= element.childNodes.length - 1; i++) {
                var groupNode = element.childNodes[i];

                if (groupNode.nodeName.toUpperCase() === 'G') {

                    var genId = 'shape-id-' + $this.uniqueId();

                    groupNode.id = genId;
                    groupNode.style.display = 'none';

                    elementIds.push(genId);

                }
            }

            return {
                object: new SVGMorpheus(element),
                data: {
                    groupIds: elementIds
                }
            };
        },
        uniqueId: function () {
            var date = Date.now();

            // If created at same millisecond as previous
            if (date <= this.uniqueId.previous) {
                date = ++this.uniqueId.previous;
            } else {
                this.uniqueId.previous = date;
            }

            return date;
        },
        handleQueue: function (morpheusInitialized, opts) {
            var morpheusObject = morpheusInitialized.object;
            var morpheusData = morpheusInitialized.data;

            morpheusObject.queue(
                morpheusData.groupIds,
                opts.animOpts
            );
        },
        handleScrollProgress: function (morpheusInitialized, opts) {
            var morpheusObject = morpheusInitialized.object;
            var morpheusData = morpheusInitialized.data;

            var shapeIndex = typeof opts.shapeIndex === 'undefined' ? 0 : opts.shapeIndex;
            morpheusObject.setupAnimationBase(morpheusData.groupIds[0]);
            morpheusObject.handleScroll(morpheusData.groupIds, opts);

            $(document).scroll(function (e) {
                morpheusObject.handleScroll(morpheusData.groupIds, opts);
            });
        }
    };

    $.fn.SVGMorpheus = function (options) {

        if (typeof options === 'undefined') {
            options = {};
        }

        var $tools = $.SVGMorpheus;

        var opts = new $tools.options(options);

        this.each(function () {

            var element = $(this)[0];

            var morpheusInitData = $tools.instantize(element);

            switch (opts.action) {

                case 'queue' :

                    $.SVGMorpheus.handleQueue(morpheusInitData, opts);

                    break;
                case 'scrollProgress':

                    $.SVGMorpheus.handleScrollProgress(morpheusInitData, opts);

                    break;
                default:
                    break;
            }
        });

    };

}(jQuery));