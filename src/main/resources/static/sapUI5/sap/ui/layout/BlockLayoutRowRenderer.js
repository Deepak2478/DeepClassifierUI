/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library'],function(q,l){"use strict";var B={};B.render=function(r,b){this.startRow(r,b);this.renderContent(r,b);this.endRow(r,b);};B.startRow=function(r,b){r.write("<div");r.writeControlData(b);r.addClass("sapUiBlockLayoutRow");this.addRowRenderingClass(r,b);r.writeStyles();r.writeClasses();r.write(">");};B.addRowRenderingClass=function(r,b){if(b.getScrollable()){r.addClass("sapUiBlockScrollingRow");if(b.getContent().length>=6){r.addClass("sapUiBlockScrollingNarrowCells");}}else{r.addClass("sapUiBlockHorizontalCellsRow");}};B.renderContent=function(r,b){var c=b.getContent(),s=b.getScrollable(),o=sap.ui.layout.BlockBackgroundType,L=b.getParent().getBackground(),a=b.getAccentCells(),C=0,f;c.forEach(function(e,g){(g%2)==0?e.addStyleClass("sapUiBlockLayoutOddCell"):e.addStyleClass("sapUiBlockLayoutEvenCell");if(s){e.addStyleClass("sapUiBlockScrollableCell");}else{e.addStyleClass("sapUiBlockHorizontalCell");}});switch(L){case o.Mixed:b._processMixedCellStyles(a[0],c);break;case o.Accent:b._processAccentCellStyles(a,c);break;}var d=b._getCellArangementForCurrentSize();if(s){c.forEach(r.renderControl);}else if(d){for(var i=0;i<d.length;i++){var S=d[i];r.write("<div ");r.addStyle("display","flex");r.writeStyles();r.write(">");for(var j=0;j<S.length;j++){f=S[j];c[C]._setFlexWidth(f);r.renderControl(c[C]);C++;}r.write("</div>");}}};B.endRow=function(r){r.write("</div>");};return B;},true);