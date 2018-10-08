/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","./library","sap/ui/Device","sap/ui/core/ResizeHandler","sap/ui/core/Control","sap/ui/core/InvisibleText","sap/m/Button","sap/m/NavContainer"],function(q,l,D,R,C,I,B,N){"use strict";var L=l.LayoutType;var F=C.extend("sap.f.FlexibleColumnLayout",{metadata:{properties:{layout:{type:"sap.f.LayoutType",defaultValue:sap.f.LayoutType.OneColumn},defaultTransitionNameBeginColumn:{type:"string",group:"Appearance",defaultValue:"slide"},defaultTransitionNameMidColumn:{type:"string",group:"Appearance",defaultValue:"slide"},defaultTransitionNameEndColumn:{type:"string",group:"Appearance",defaultValue:"slide"}},aggregations:{beginColumnPages:{type:"sap.ui.core.Control",multiple:true},midColumnPages:{type:"sap.ui.core.Control",multiple:true},endColumnPages:{type:"sap.ui.core.Control",multiple:true},_beginColumnNav:{type:"sap.m.NavContainer",multiple:false,visibility:"hidden"},_midColumnNav:{type:"sap.m.NavContainer",multiple:false,visibility:"hidden"},_endColumnNav:{type:"sap.m.NavContainer",multiple:false,visibility:"hidden"},_beginColumnBackArrow:{type:"sap.m.Button",multiple:false,visibility:"hidden"},_midColumnForwardArrow:{type:"sap.m.Button",multiple:false,visibility:"hidden"},_midColumnBackArrow:{type:"sap.m.Button",multiple:false,visibility:"hidden"},_endColumnForwardArrow:{type:"sap.m.Button",multiple:false,visibility:"hidden"}},associations:{initialBeginColumnPage:{type:"sap.ui.core.Control",multiple:false},initialMidColumnPage:{type:"sap.ui.core.Control",multiple:false},initialEndColumnPage:{type:"sap.ui.core.Control",multiple:false}},events:{stateChange:{parameters:{layout:{type:"sap.f.LayoutType"},maxColumnsCount:{type:"int"},isNavigationArrow:{type:"boolean"},isResize:{type:"boolean"}}},beginColumnNavigate:{allowPreventDefault:true,parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},afterBeginColumnNavigate:{parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},midColumnNavigate:{allowPreventDefault:true,parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},afterMidColumnNavigate:{parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},endColumnNavigate:{allowPreventDefault:true,parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},afterEndColumnNavigate:{parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}}}}});F.prototype.init=function(){this._initNavContainers();this._initButtons();this._oLayoutHistory=new a();};F.prototype._createNavContainer=function(c){var s=c.charAt(0).toUpperCase()+c.slice(1);return new N(this.getId()+"-"+c+"ColumnNav",{navigate:function(e){this._handleNavigationEvent(e,false,c);}.bind(this),afterNavigate:function(e){this._handleNavigationEvent(e,true,c);}.bind(this),defaultTransitionName:this["getDefaultTransitionName"+s+"Column"]()});};F.prototype._handleNavigationEvent=function(e,A,c){var E,b;if(A){E="after"+(c.charAt(0).toUpperCase()+c.slice(1))+"ColumnNavigate";}else{E=c+"ColumnNavigate";}b=this.fireEvent(E,e.mParameters,true);if(!b){e.preventDefault();}};F.prototype._getBeginColumn=function(){return this.getAggregation("_beginColumnNav");};F.prototype._getMidColumn=function(){return this.getAggregation("_midColumnNav");};F.prototype._getEndColumn=function(){return this.getAggregation("_endColumnNav");};F.prototype._flushColumnContent=function(c){var o=this.getAggregation("_"+c+"ColumnNav"),r=sap.ui.getCore().createRenderManager();r.renderControl(o);r.flush(this._$columns[c].find(".sapFFCLColumnContent")[0],undefined,true);r.destroy();};F.prototype.setLayout=function(n){n=this.validateProperty("layout",n);var c=this.getLayout();if(c===n){return this;}var r=this.setProperty("layout",n,true);this._oLayoutHistory.addEntry(n);this._resizeColumns();this._hideShowArrows();return r;};F.prototype.onBeforeRendering=function(){this._deregisterResizeHandler();};F.prototype.onAfterRendering=function(){this._registerResizeHandler();this._cacheDOMElements();this._hideShowArrows();this._resizeColumns();this._flushColumnContent("begin");this._flushColumnContent("mid");this._flushColumnContent("end");this._fireStateChange(false,false);};F.prototype._getControlWidth=function(){return this.$().width();};F.prototype.exit=function(){this._deregisterResizeHandler();this._handleEvent(q.Event("Destroy"));};F.prototype._registerResizeHandler=function(){this._iResizeHandlerId=R.register(this,this._onResize.bind(this));};F.prototype._deregisterResizeHandler=function(){if(this._iResizeHandlerId){R.deregister(this._iResizeHandlerId);this._iResizeHandlerId=null;}};F.prototype._initNavContainers=function(){this.setAggregation("_beginColumnNav",this._createNavContainer("begin"),true);this.setAggregation("_midColumnNav",this._createNavContainer("mid"),true);this.setAggregation("_endColumnNav",this._createNavContainer("end"),true);};F.prototype._initButtons=function(){var b=new B(this.getId()+"-beginBack",{icon:"sap-icon://slim-arrow-left",tooltip:F._getResourceBundle().getText("FCL_BEGIN_COLUMN_BACK_ARROW"),press:this._onArrowClick.bind(this,"left")}).addStyleClass("sapFFCLNavigationButton").addStyleClass("sapFFCLNavigationButtonRight");this.setAggregation("_beginColumnBackArrow",b,true);var m=new B(this.getId()+"-midForward",{icon:"sap-icon://slim-arrow-right",tooltip:F._getResourceBundle().getText("FCL_MID_COLUMN_FORWARD_ARROW"),press:this._onArrowClick.bind(this,"right")}).addStyleClass("sapFFCLNavigationButton").addStyleClass("sapFFCLNavigationButtonLeft");this.setAggregation("_midColumnForwardArrow",m,true);var M=new B(this.getId()+"-midBack",{icon:"sap-icon://slim-arrow-left",tooltip:F._getResourceBundle().getText("FCL_MID_COLUMN_BACK_ARROW"),press:this._onArrowClick.bind(this,"left")}).addStyleClass("sapFFCLNavigationButton").addStyleClass("sapFFCLNavigationButtonRight");this.setAggregation("_midColumnBackArrow",M,true);var e=new B(this.getId()+"-endForward",{icon:"sap-icon://slim-arrow-right",tooltip:F._getResourceBundle().getText("FCL_END_COLUMN_FORWARD_ARROW"),press:this._onArrowClick.bind(this,"right")}).addStyleClass("sapFFCLNavigationButton").addStyleClass("sapFFCLNavigationButtonLeft");this.setAggregation("_endColumnForwardArrow",e,true);};F.prototype._cacheDOMElements=function(){this._cacheColumns();if(!D.system.phone){this._cacheArrows();}};F.prototype._cacheColumns=function(){this._$columns={begin:this.$("beginColumn"),mid:this.$("midColumn"),end:this.$("endColumn")};};F.prototype._cacheArrows=function(){this._$columnButtons={beginBack:this.$("beginBack"),midForward:this.$("midForward"),midBack:this.$("midBack"),endForward:this.$("endForward")};};F.prototype._getVisibleColumnsCount=function(){return["begin","mid","end"].filter(function(c){return this._getColumnSize(c)>0;},this).length;};F.prototype._resizeColumns=function(){var p,n,s,t,A,b=false,c=["begin","mid","end"],r=sap.ui.getCore().getConfiguration().getRTL(),d,v;if(!this.isActive()){return;}v=this._getVisibleColumnsCount();if(v===0){return;}t=(v-1)*F.COLUMN_MARGIN;A=this._getControlWidth()-t;c.forEach(function(e){p=this._getColumnSize(e);this._$columns[e].toggleClass("sapFFCLColumnMargin",b&&p>0);this._$columns[e].toggleClass("sapFFCLColumnActive",p>0);this._$columns[e].removeClass("sapFFCLColumnOnlyActive");this._$columns[e].removeClass("sapFFCLColumnLastActive");this._$columns[e].removeClass("sapFFCLColumnFirstActive");n=Math.round(A*(p/100));if([100,0].indexOf(p)!==-1){s=p+"%";}else{s=n+"px";}this._$columns[e].width(s);if(!D.system.phone){this._updateColumnContextualSettings(e,n);this._updateColumnCSSClasses(e,n);}if(p>0){b=true;}},this);d=c.filter(function(e){return this._getColumnSize(e)>0;},this);if(r){c.reverse();}if(d.length===1){this._$columns[d[0]].addClass("sapFFCLColumnOnlyActive");}if(d.length>1){this._$columns[d[0]].addClass("sapFFCLColumnFirstActive");this._$columns[d[d.length-1]].addClass("sapFFCLColumnLastActive");}};F.prototype._propagateContextualSettings=function(){};F.prototype._updateColumnContextualSettings=function(c,w){var o,b;o=this.getAggregation("_"+c+"ColumnNav");if(!o){return;}b=o._getContextualSettings();if(!b||b.contextualWidth!==w){o._applyContextualSettings({contextualWidth:w});}};F.prototype._updateColumnCSSClasses=function(c,w){var n="";this._$columns[c].removeClass("sapUiContainer-Narrow sapUiContainer-Medium sapUiContainer-Wide sapUiContainer-ExtraWide");if(w<D.media._predefinedRangeSets[D.media.RANGESETS.SAP_STANDARD_EXTENDED].points[0]){n="Narrow";}else if(w<D.media._predefinedRangeSets[D.media.RANGESETS.SAP_STANDARD_EXTENDED].points[1]){n="Medium";}else if(w<D.media._predefinedRangeSets[D.media.RANGESETS.SAP_STANDARD_EXTENDED].points[2]){n="Wide";}else{n="ExtraWide";}this._$columns[c].addClass("sapUiContainer-"+n);};F.prototype._getColumnSize=function(c){var s=this.getLayout(),b=this._getColumnWidthDistributionForLayout(s),S=b.split("/"),m={begin:0,mid:1,end:2},d=S[m[c]];return parseInt(d,10);};F.prototype.getMaxColumnsCount=function(){return this._getMaxColumnsCountForWidth(this._getControlWidth());};F.prototype._getMaxColumnsCountForWidth=function(w){if(w>=F.DESKTOP_BREAKPOINT){return 3;}if(w>=F.TABLET_BREAKPOINT&&w<F.DESKTOP_BREAKPOINT){return 2;}if(w>0){return 1;}return 0;};F.prototype._onResize=function(e){var o=e.oldSize.width,n=e.size.width,O,m;if(n===0){return;}O=this._getMaxColumnsCountForWidth(o);m=this._getMaxColumnsCountForWidth(n);this._resizeColumns();if(m!==O){this._hideShowArrows();this._fireStateChange(false,true);}};F.prototype._onArrowClick=function(s){var b=this.getLayout(),m={TwoColumnsBeginExpanded:{"left":L.TwoColumnsMidExpanded},TwoColumnsMidExpanded:{"right":L.TwoColumnsBeginExpanded},ThreeColumnsMidExpanded:{"left":L.ThreeColumnsEndExpanded,"right":L.ThreeColumnsMidExpandedEndHidden},ThreeColumnsEndExpanded:{"right":L.ThreeColumnsMidExpanded},ThreeColumnsMidExpandedEndHidden:{"left":L.ThreeColumnsMidExpanded,"right":L.ThreeColumnsBeginExpandedEndHidden},ThreeColumnsBeginExpandedEndHidden:{"left":L.ThreeColumnsMidExpandedEndHidden}};b=typeof m[b]!=="undefined"&&typeof m[b][s]!=="undefined"?m[b][s]:L.OneColumn;this.setLayout(b);this._fireStateChange(true,false);};F.prototype._hideShowArrows=function(){var s=this.getLayout(),m={},n=[],M;if(!this.isActive()||D.system.phone){return;}M=this.getMaxColumnsCount();if(M>1){m[L.TwoColumnsBeginExpanded]=["beginBack"];m[L.TwoColumnsMidExpanded]=["midForward"];m[L.ThreeColumnsMidExpanded]=["midForward","midBack"];m[L.ThreeColumnsEndExpanded]=["endForward"];m[L.ThreeColumnsMidExpandedEndHidden]=["midForward","midBack"];m[L.ThreeColumnsBeginExpandedEndHidden]=["beginBack"];if(typeof m[s]==="object"){n=m[s];}}this._toggleButton("beginBack",n.indexOf("beginBack")!==-1);this._toggleButton("midForward",n.indexOf("midForward")!==-1);this._toggleButton("midBack",n.indexOf("midBack")!==-1);this._toggleButton("endForward",n.indexOf("endForward")!==-1);};F.prototype._toggleButton=function(b,s){this._$columnButtons[b].toggle(s);};F.prototype._fireStateChange=function(i,b){if(this._getControlWidth()===0){return;}this.fireStateChange({isNavigationArrow:i,isResize:b,layout:this.getLayout(),maxColumnsCount:this.getMaxColumnsCount()});};F.prototype.getBeginColumnPages=function(){return this._getBeginColumn().getPages();};F.prototype.addBeginColumnPage=function(p){this._getBeginColumn().addPage(p);return this;};F.prototype.insertBeginColumnPage=function(p,i){this._getBeginColumn().insertPage(p,i);return this;};F.prototype.removeBeginColumnPage=function(p){this._getBeginColumn().removePage(p);return this;};F.prototype.removeAllBeginColumnPages=function(){return this._getBeginColumn().removeAllPages();};F.prototype.getMidColumnPages=function(){return this._getMidColumn().getPages();};F.prototype.addMidColumnPage=function(p){this._getMidColumn().addPage(p);return this;};F.prototype.insertMidColumnPage=function(p,i){this._getMidColumn().insertPage(p,i);return this;};F.prototype.removeMidColumnPage=function(p){this._getMidColumn().removePage(p);return this;};F.prototype.removeAllMidColumnPages=function(){return this._getMidColumn().removeAllPages();};F.prototype.getEndColumnPages=function(){return this._getEndColumn().getPages();};F.prototype.addEndColumnPage=function(p){this._getEndColumn().addPage(p);return this;};F.prototype.insertEndColumnPage=function(p,i){this._getEndColumn().insertPage(p,i);return this;};F.prototype.removeEndColumnPage=function(p){this._getEndColumn().removePage(p);return this;};F.prototype.removeAllEndColumnPages=function(){return this._getEndColumn().removeAllPages();};F.prototype.setInitialBeginColumnPage=function(p){this._getBeginColumn().setInitialPage(p);this.setAssociation('initialBeginColumnPage',p,true);return this;};F.prototype.setInitialMidColumnPage=function(p){this._getMidColumn().setInitialPage(p);this.setAssociation('initialMidColumnPage',p,true);return this;};F.prototype.setInitialEndColumnPage=function(p){this._getEndColumn().setInitialPage(p);this.setAssociation('initialEndColumnPage',p,true);return this;};F.prototype.to=function(p,t,d,T){if(this._getBeginColumn().getPage(p)){this._getBeginColumn().to(p,t,d,T);}else if(this._getMidColumn().getPage(p)){this._getMidColumn().to(p,t,d,T);}else{this._getEndColumn().to(p,t,d,T);}};F.prototype.backToPage=function(p,b,t){if(this._getBeginColumn().getPage(p)){this._getBeginColumn().backToPage(p,b,t);}else if(this._getMidColumn().getPage(p)){this._getMidColumn().backToPage(p,b,t);}else{this._getEndColumn().backToPage(p,b,t);}};F.prototype._safeBackToPage=function(p,t,b,T){if(this._getBeginColumn().getPage(p)){this._getBeginColumn()._safeBackToPage(p,t,b,T);}else if(this._getMidColumn().getPage(p)){this._getMidColumn()._safeBackToPage(p,t,b,T);}else{this._getEndColumn()._safeBackToPage(p,t,b,T);}};F.prototype.toBeginColumnPage=function(p,t,d,T){this._getBeginColumn().to(p,t,d,T);};F.prototype.toMidColumnPage=function(p,t,d,T){this._getMidColumn().to(p,t,d,T);};F.prototype.toEndColumnPage=function(p,t,d,T){this._getEndColumn().to(p,t,d,T);};F.prototype.backBeginColumn=function(b,t){return this._getBeginColumn().back(b,t);};F.prototype.backMidColumn=function(b,t){return this._getMidColumn().back(b,t);};F.prototype.backEndColumn=function(b,t){return this._getEndColumn().back(b,t);};F.prototype.backBeginColumnToPage=function(p,b,t){return this._getBeginColumn().backToPage(p,b,t);};F.prototype.backMidColumnToPage=function(p,b,t){return this._getMidColumn().backToPage(p,b,t);};F.prototype.backEndColumnToPage=function(p,b,t){return this._getEndColumn().backToPage(p,b,t);};F.prototype.backToTopBeginColumn=function(b,t){this._getBeginColumn().backToTop(b,t);};F.prototype.backToTopMidColumn=function(b,t){this._getMidColumn().backToTop(b,t);};F.prototype.backToTopEndColumn=function(b,t){this._getEndColumn().backToTop(b,t);};F.prototype.getCurrentBeginColumnPage=function(){return this._getBeginColumn().getCurrentPage();};F.prototype.getCurrentMidColumnPage=function(){return this._getMidColumn().getCurrentPage();};F.prototype.getCurrentEndColumnPage=function(){return this._getEndColumn().getCurrentPage();};F.prototype.setDefaultTransitionNameBeginColumn=function(t){this.setProperty("defaultTransitionNameBeginColumn",t,true);this._getBeginColumn().setDefaultTransitionName(t);return this;};F.prototype.setDefaultTransitionNameMidColumn=function(t){this.setProperty("defaultTransitionNameMidColumn",t,true);this._getMidColumn().setDefaultTransitionName(t);return this;};F.prototype.setDefaultTransitionNameEndColumn=function(t){this.setProperty("defaultTransitionNameEndColumn",t,true);this._getEndColumn().setDefaultTransitionName(t);return this;};F.prototype._getLayoutHistory=function(){return this._oLayoutHistory;};F.prototype._getColumnWidthDistributionForLayout=function(s,A){var m=this.getMaxColumnsCount(),M={},r;if(m===0){r="0/0/0";}else{M[L.OneColumn]="100/0/0";M[L.MidColumnFullScreen]="0/100/0";M[L.EndColumnFullScreen]="0/0/100";if(m===1){M[L.TwoColumnsBeginExpanded]="0/100/0";M[L.TwoColumnsMidExpanded]="0/100/0";M[L.ThreeColumnsMidExpanded]="0/0/100";M[L.ThreeColumnsEndExpanded]="0/0/100";M[L.ThreeColumnsMidExpandedEndHidden]="0/0/100";M[L.ThreeColumnsBeginExpandedEndHidden]="0/0/100";}else{M[L.TwoColumnsBeginExpanded]="67/33/0";M[L.TwoColumnsMidExpanded]="33/67/0";M[L.ThreeColumnsMidExpanded]=m===2?"0/67/33":"25/50/25";M[L.ThreeColumnsEndExpanded]=m===2?"0/33/67":"25/25/50";M[L.ThreeColumnsMidExpandedEndHidden]="33/67/0";M[L.ThreeColumnsBeginExpandedEndHidden]="67/33/0";}r=M[s];}if(A){r=r.split("/").map(function(c){return parseInt(c,10);});}return r;};F.COLUMN_MARGIN=8;F.DESKTOP_BREAKPOINT=1280;F.TABLET_BREAKPOINT=960;F._getResourceBundle=function(){return sap.ui.getCore().getLibraryResourceBundle("sap.f");};F._getAriaLabels=function(){if(!F._sAriaFlexibleColumnLayoutLabels){F._sAriaFlexibleColumnLayoutLabels={beginColumnLabel:F._getARIAInvisibleTextId("FCL_BEGIN_COLUMN_REGION_TEXT"),midColumnLabel:F._getARIAInvisibleTextId("FCL_MID_COLUMN_REGION_TEXT"),endColumnLabel:F._getARIAInvisibleTextId("FCL_END_COLUMN_REGION_TEXT")};}return F._sAriaFlexibleColumnLayoutLabels;};F._getARIAInvisibleTextId=function(r){return new I({text:F._getResourceBundle().getText(r)}).toStatic().getId();};function a(){this._aLayoutHistory=[];}a.prototype.addEntry=function(s){if(typeof s!=="undefined"){this._aLayoutHistory.push(s);}};a.prototype.getClosestEntryThatMatches=function(b){var i;for(i=this._aLayoutHistory.length-1;i>=0;i--){if(b.indexOf(this._aLayoutHistory[i])!==-1){return this._aLayoutHistory[i];}}};return F;},true);
