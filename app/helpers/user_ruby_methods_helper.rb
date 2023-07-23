module UserRubyMethodsHelper
  def convert_text(user_ruby_method)
    return '知っているに移動' if user_ruby_method.remembered == false

    '知らないに移動' if user_ruby_method.remembered == true
  end

  def module_name(user_ruby_method)
    user_ruby_method.ruby_method.ruby_module.name
  end
end
