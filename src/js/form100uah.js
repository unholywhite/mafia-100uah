(function ($) {
  'use strict';

  // Label behave as a placeholder
  $(function () {
    $('.__check-blur').blur(function () {
      var formLabel = $(this).parent().find('label');
      $(this).val() !== '' ? formLabel.addClass('__active') : formLabel.removeClass('__active');
    });
    $('.__check-blur').each(function () {
      var formLabel = $(this).parent().find('label');
      $(this).val() !== '' ? formLabel.addClass('__active') : formLabel.removeClass('__active');
    });
  });

  // Phone mask

  $(function () {
    var phoneInput = $('.input-phone');
    phoneInput.mask('+38 (099) 999-99-99', {placeholder: '_'});
    phoneInput.on('focus', function () {
      if (phoneInput.val() === '') {
        phoneInput.val('+38 (0 ');
      }
    });
    $(phoneInput).on('blur', function () {
      if(phoneInput.val().length !== 19) {
        phoneInput.val('');
        phoneInput.parent().find('label').removeClass('__active');
      }
    });
  });

  // Date mask
  $(function () {
    var dateInput = $('.input-date');
    dateInput.mask('9999-99-99', {placeholder: '_'});
    dateInput.on('blur', function () {
      if(dateInput.val().length !== 10) {
        dateInput.val('');
        dateInput.parent().find('label').removeClass('__active');
      }
    });
  });

  // validation - ukrainian phone number in international format
  $.validator.methods.phoneUA = function (value, element) {
    return this.optional(element) || /\+38 \(0\d{2}\) \d{3}-\d{2}-\d{2}/.test(value);
  }

  // Form validation
  $(function () {
    $('#form100').validate({
      ignore: [],
      rules: {
        'form100-name': {
          required: true
        },
        'form100-phone': {
          required: true,
          phoneUA: true
        },
        'form100-email': {
          required: true
        },
        'form100-rules': {
          required: true
        }
      },
      errorPlacement: function (error, element) {
        error.addClass('__error');
        error.appendTo(element.closest('.form-item').find('.form-item-error'));
      },
      highlight: function (element, errorClass) {
        $(element).closest('.validation-item').addClass(errorClass);
      },
      unhighlight: function (element, errorClass) {
        $(element).closest('.validation-item').removeClass(errorClass);
      }
    });
  });


})(jQuery);
