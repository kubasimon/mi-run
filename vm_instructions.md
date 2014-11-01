`push <int>` - vlozi na zasobnik cislo

`load #index` - vlozi na zasobnik z lokalni promenne

`store #index` - ulozi do lokalni promenne hodnotu ze zasobniku

`add` - secte hondnoty na zasobniku

`subtract` - odecte hodnoty na zasobniku

`compare` - porovna hodnoty na zasobniku, *deprecated*

`greater` - >

`greater_or_equal` - >=

`less` - <

`less_or_equal` - <=

`equal` - ==

`conditional_jump #instruction` - pokud je na zasobniku > 1, tak skoci na danou instruci relativne

`jump #instruction` - skoci na instrukci relativne

`greater_jump #instruction`

`greater_or_equal_jump #instruction`

`less_jump #instruction`

`less_or_equal_jump #instruction`

`equal_jump #instruction`

`duplicate` - duplikuje vrchol zasobniku

`negate` - neguje vrchol zasobniku, 0 -> 1, ostatni -> 0

`return_value` - vyskoci z funkce a vrati hodnotu ze zasobniku

`return` - vyskoci z funkce

`terminate` - konec programu:)

`new_array` - vytvori nove pole

`new_object` - vytvori novy objekt

`create_closure` - vytvori closure

`object_store #property` - ulozi do property objektu na zasobniku dalsi hodnotu na zasobniku

`object_load #property` - nacte property objektu na zasobnik

`invoke #name` - zavola funkci (#name), argumenty jsou na zasobniku 
 
`invoke_native #name` - zavola 'nativni' metodu (#name) na objektu (array, object, file) 

`built_in #index` - zavola build-in funkci - (0 - print, 1 - fs_open_file, 3 - parseInt)

`push_c ##index` - vlozi na zasobnik z constant poolu # not generated
