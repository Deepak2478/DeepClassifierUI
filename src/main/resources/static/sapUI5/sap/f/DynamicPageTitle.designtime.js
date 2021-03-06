/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";return{aggregations:{heading:{domRef:":sap-domref .sapFDynamicPageTitleLeftHeading"},actions:{domRef:function(e){return e.$("overflowToolbar").get(0);},actions:{split:{changeType:"splitMenuButton"},combine:{changeType:"combineButtons"}}},content:{domRef:":sap-domref .sapFDynamicPageTitleContent",actions:{move:{changeType:"moveControls"}}},snappedContent:{domRef:function(e){return e.$("snapped-wrapper").get(0);},actions:{move:{changeType:"moveControls"}}},expandedContent:{domRef:function(e){return e.$("expand-wrapper").get(0);},actions:{move:{changeType:"moveControls"}}}},actions:{remove:{changeType:"hideControl"},reveal:{changeType:"unhideControl"}},name:{singular:"DYNAMIC_PAGE_TITLE_NAME",plural:"DYNAMIC_PAGE_TITLE_NAME_PLURAL"}};},false);
