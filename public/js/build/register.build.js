/*! stphils-fullon2014 - v0.0.4 - 14-10-2013 */fullon.views.register.common=Backbone.View.extend({initialize:function(){this.$inputs=$("input"),this.$camper_type_radio=$("input[name=camper_type]"),this.$next_buttons=$(".navigation .btn[data-action=next]");var self=this;this.listenTo(fullon.vent,"input:validate",function($el){self.validate_item($el.closest(".form-group")),self.check_if_button_can_be_re_enabled($el.closest("section"))}),this.listenTo(fullon.vent,"input:validate_section",function($section,cb){var success=this.validation_section($section);cb(success)}),this.$inputs.on("change",function(){console.log("input [change] event fired");var $this=$(this);$this.hasClass("datepicker")&&fullon.vent.trigger("input:validate",$this),($this.is(":radio")||$this.is(":checkbox"))&&fullon.vent.trigger("input:validate",$this)}),this.$inputs.on("focusout",function(){var $this=$(this);$this.hasClass("datepicker")||fullon.vent.trigger("input:validate",$this)}),this.$next_buttons.on("click",function(event){event.preventDefault(),event.stopPropagation();var $section=$(this).closest("section"),success=self.validation_section($section);success&&fullon.vent.trigger("navigate:next",$section)}),this.$form_groups=$(".form-group"),fullon.vent.on("camper_type:change",this.on_camper_type_change,this)},on_camper_type_change:function(){var camper_type=fullon.state.camper_type;this.$form_groups.each(function(){var $this=$(this),available_to=$this.attr("data-available-to");return available_to?(available_to=available_to.split("|"),_.contains(available_to,camper_type)?($this.show(),$this.closest(".discount_row").show()):($this.hide(),$this.closest(".discount_row").hide()),void 0):!0})},validation_section:function($section){var $form_groups=$section.find(".form-group:visible"),success=!0,self=this;return $form_groups.each(function(){self.validate_item($(this))||(success=!1)}),this.enable_navigation_buttons($section,success),success},validate_item:function($form_group){var val,$inputs=$form_group.find("input, textarea, select");val=$inputs.length>1?$form_group.find("input:checked").val():$inputs.val();var rules=$form_group.attr("data-validation");if(!rules)return!0;rules=rules.split("|");var success=!0,required=_.contains(rules,"required:true");return(required||!required&&""!==val)&&(success=_.every(rules,function(rule){var components=rule.split(":"),rule_name=components[0],rule_param=components[1];return fullon.validation[rule_name].fn(val,rule_param)})),success?($form_group.attr("data-valid",!0),$form_group.removeClass("has-error"),$form_group.find(".validation_message").removeClass("show").addClass("hide")):($form_group.attr("data-valid",!1),$form_group.addClass("has-error"),$form_group.find(".validation_message").removeClass("hide").addClass("show")),success},check_if_button_can_be_re_enabled:function($section){var $invalid_groups=$section.find(".form-group[data-valid=false]:visible");this.enable_navigation_buttons($section,$invalid_groups.length?!1:!0)},enable_navigation_buttons:function($section,enable){console.log("enable navigation buttons",enable);var $navigation=$section.find(".navigation");enable?($navigation.find(".btn[data-action=next]").attr("disabled",!1).removeClass("btn-danger"),$navigation.find(".navigation_cant_continue").addClass("hide")):($navigation.find(".btn[data-action=next]").attr("disabled",!0).addClass("btn-danger"),$navigation.find(".navigation_cant_continue").removeClass("hide"))}}),fullon.views.register.allegiance=Backbone.View.extend({initialize:function(){this.$camper_types=$("input:radio[name=camper_type]"),this.$camper_type_labels=$(".camper_type_label"),this.$camper_type_flags=$(".camper_type_flag"),this.$navigation_button_container=$("#allegiance_navigation_container","#allegiance"),this.$camper_type_row=$("#camper_type_row","#allegiance");var self=this;$("#allegiance img").on("click",function(event){event.stopPropagation(),self.allegiance_toggle($(this).attr("id"))}),this.$camper_type_row.removeClass("invisible")},constants:{flag:function(){var prefix="camper_type_flag_";return{prefix:prefix,regex:new RegExp("^"+prefix)}}()},allegiance_toggle:function(camper_type){var self=this;fullon.state.camper_type=camper_type,console.log("selecting camper type: ",fullon.state.camper_type),this.$camper_types.each(function(){$(this).removeAttr("checked")}),this.$camper_types.filter("[value="+fullon.state.camper_type+"]").attr("checked","checked"),this.$camper_type_labels.text(fullon.state.camper_type),this.$camper_type_flags.each(function(){var $this=$(this),clean=[];_.each($this.attr("class").split(" "),function(css){self.constants.flag.regex.test(css)||clean.push(css)}),$this.attr("class",clean.join(" "))}),this.$camper_type_flags.each(function(){$(this).addClass(self.constants.flag.prefix+fullon.state.camper_type)}),this.$navigation_button_container.removeClass("invisible"),fullon.vent.trigger("camper_type:change")}}),fullon.views.register.costs=Backbone.View.extend({selectors:{section:"#costs",radio_discount:"input[name=chocolate]",dropdown:"#discount_chocolate_dropdown",camp_fee:".camp_fee",camp_fee_total:".camp_fee_total",row:".row",discount_display:".discount_amount",row_amount_display:".amount_display",data:{current_value:"data-current-value"}},initialize:function(){this.$discount_inputs=$("input:radio:not("+this.selectors.radio_discount+")",this.selectors.section),this.$donation_input=$("input[name=donation]"),this.$dropdown_toggle=$(this.selectors.radio_discount,this.selectors.section),this.$dropdown=$(this.selectors.dropdown,this.selectors.section),this.$camp_fee=$(this.selectors.camp_fee,this.selectors.section),this.$camp_fee_total=$(this.selectors.camp_fee_total),this.$discount_displays=$(this.selectors.discount_display,this.selectors.section);var self=this;this.$dropdown_toggle.on("change",function(){var show="yes"===$(this).val();self.show_dropdown(show),self.use_dropdown(show)}),this.$dropdown.on("change",function(){self.use_dropdown(!0)}),this.$discount_inputs.on("change",function(){self.update_discount_item($(this))}),this.$donation_input.on("focusout",function(){self.update_donantion_item()}),this.listenTo(fullon.vent,"camper_type:change",this.on_camper_type_change)},on_camper_type_change:function(){var fee=fullon.config.camper_types[fullon.state.camper_type].fee;this.$camp_fee.attr(this.selectors.data.current_value,fee),this.$camp_fee.text("$"+fee),this.update_fee_total()},is_donation_input_valid:function(){return!this.$donation_input.closest(".form-group[data-valid=false]").length&&""!==this.$donation_input.val()},update_donantion_item:function(){setTimeout(function(){return this.is_donation_input_valid()?this.set_row_amount(this.$donation_input,this.$donation_input.val()):this.set_row_amount(this.$donation_input,0)}.bind(this),0)},update_discount_item:function($el){console.log("input item has been toggled");var name=$el.attr("name"),add="yes"===$el.val(),val=add?fullon.config.discounts[name].amount:0;this.set_row_amount($el,val)},set_row_amount:function($el,val){$el.closest(this.selectors.row).find(this.selectors.row_amount_display).attr(this.selectors.data.current_value,val).text("$"+val),this.update_fee_total()},update_fee_total:function(){var self=this,fee=fullon.config.camper_types[fullon.state.camper_type].fee,visible_discounts=this.$discount_displays.filter(":visible");if(visible_discounts.each(function(){fee-=parseFloat($(this).attr(self.selectors.data.current_value))}),this.is_donation_input_valid()){var donation=parseFloat(this.$donation_input.val());_.isNumber(donation)&&(fee+=donation)}fee=0>fee?0:fee,this.$camp_fee_total.attr(this.selectors.data.current_value,fee).text("$"+fee)},use_dropdown:function(show){var val=fullon.config.discounts.chocolate.amount*parseFloat(this.$dropdown.val());if(this.set_row_amount(this.$dropdown,show?val:0),show){var $selected=$(this.$dropdown.find(":selected"));fullon.vent.trigger("chocolate_dropdown:change",{first_name:$selected.attr("data-first-name"),last_name:$selected.attr("data-last-name")})}},show_dropdown:function(show){this.$dropdown.closest(".form-group").removeClass(show?"hide":"show").addClass(show?"show":"hide"),show||fullon.vent.trigger("chocolate_dropdown:remove")}}),fullon.views.register.basic=Backbone.View.extend({initialize:function(){this.$basic_fields=$("input[name=first_name], input[name=last_name], input[name=email]","#basic"),this.$basic_fields.on("change",function(){console.log("basic info updated - update auto complete fields"),fullon.vent.trigger("basic_info:update")}),fullon.vent.on("chocolate_dropdown:change",this.on_chocolate_dropdown_change,this),fullon.vent.on("chocolate_dropdown:remove",this.on_chocolate_dropdown_remove,this)},on_chocolate_dropdown_remove:function(){console.log("basic: on_chocolate_dropdown_remove"),this.$basic_fields.filter("[name=first_name]").val("").attr("disabled",!1),this.$basic_fields.filter("[name=last_name]").val("").attr("disabled",!1)},on_chocolate_dropdown_change:function(data){console.log("basic: on_chocolate_dropdown_change",data),this.$basic_fields.filter("[name=first_name]").val(data.first_name).attr("disabled",!0),this.$basic_fields.filter("[name=last_name]").val(data.last_name).attr("disabled",!0),fullon.vent.trigger("basic_info:update")}}),fullon.views.register.payment=Backbone.View.extend({initialize:function(){this.$payer_radios=$("input[name=is_payer_registering]","#payment"),this.$camper_first_name=$("input[name=first_name]","#basic"),this.$camper_last_name=$("input[name=last_name]","#basic"),this.$camper_email=$("input[name=email]","#basic"),this.$payer_first_name=$("input[name=payer_first_name]","#payment"),this.$payer_last_name=$("input[name=payer_last_name]","#payment"),this.$payer_email=$("input[name=payer_email]","#payment");var self=this;this.$payer_radios.on("change",function(){self.autofill_payer_details()}),fullon.vent.on("basic_info:update",this.autofill_payer_details,this)},update_autofill_field:function($el,val,disabled){$el.val(val).attr("disabled",disabled)},autofill_payer_details:function(){console.log("auto fill details"),"yes"===this.$payer_radios.filter(":checked").val()?(this.update_autofill_field(this.$payer_first_name,this.$camper_first_name.val(),!0),this.update_autofill_field(this.$payer_last_name,this.$camper_last_name.val(),!0),this.update_autofill_field(this.$payer_email,this.$camper_email.val(),!0)):(this.update_autofill_field(this.$payer_first_name,"",!1),this.update_autofill_field(this.$payer_last_name,"",!1),this.update_autofill_field(this.$payer_email,"",!1))}}),fullon.routers.register=Backbone.Router.extend({initialize:function(){this.common=new fullon.views.register.common,this.allegiance=new fullon.views.register.allegiance,this.costs=new fullon.views.register.costs,this.basic=new fullon.views.register.basic,this.payment=new fullon.views.register.payment,this.$form=$("form"),this.$sections=$("section"),this.$all_inputs=$("input, textarea, select"),this.$nav_buttons=$("#register_nav .nav li"),this.$back_buttons=$(".navigation .btn[data-action=back]");var bypass_refresh_check=!1;window.onbeforeunload=function(){return bypass_refresh_check?void 0:(bypass_refresh_check=!1,"Data will be lost if you leave/refresh the page")};var self=this;this.$form.on("submit",function(){console.log("attempting to submit form"),self.$all_inputs.attr("disabled",!1),bypass_refresh_check=!0}),this.$back_buttons.on("click",function(event){event.preventDefault(),event.stopPropagation();var $section=$(this).closest("section");self.on_navigate_previous($section)}),this.$nav_buttons.find("a").on("click",function(event){event.preventDefault(),event.stopPropagation(),self.on_nav_button_click($(this).closest("li"))}),this.listenTo(fullon.vent,"navigate:next",this.on_navigate_next),this.listenTo(fullon.vent,"camper_type:change",this.on_camper_type_change)},navigate_ui:function($current,$next,forward){var $current_tab=this.$nav_buttons.find("a[data-section="+$current.attr("id")+"]").closest("li");$current_tab.removeClass("active"),forward?$current_tab.removeClass("partially_completed").addClass("done"):$current_tab.addClass("partially_completed");var $next_tab=this.$nav_buttons.find("a[data-section="+$next.attr("id")+"]").closest("li");$next_tab.removeClass("pending done").addClass("active"),$current.hide(),$next.show()},on_navigate_previous:function($section){var $prev=$section.prev();$prev.length&&this.navigate_ui($section,$prev,!1)},on_navigate_next:function($section){var $next=$section.next();return $next.length?this.navigate_ui($section,$next,!0):(this.$form.submit(),void 0)},on_nav_button_click:function($li){if(!$li.hasClass("pending")){var $current_section=this.$sections.filter(":visible"),target_id=$li.find("a").attr("data-section");if(target_id!==$current_section.attr("id")){var $target_section=this.$sections.filter(function(){return $(this).attr("id")===target_id}),forward=this.$sections.index($current_section)<this.$sections.index($target_section);fullon.vent.trigger("input:validate_section",$current_section,function(success){return forward?(success?($li.removeClass("partially_complete"),this.navigate_ui($current_section,$target_section,!0)):window.alert("cannot continue forward until this section is valid"),void 0):this.navigate_ui($current_section,$target_section,!1)}.bind(this))}}},on_camper_type_change:function(){var first=!0;this.$nav_buttons.each(function(){return first?(first=!1,void 0):($(this).removeClass("partially_completed done").addClass("pending"),void 0)})}}),function(){function init(){new fullon.routers.register}init()}();