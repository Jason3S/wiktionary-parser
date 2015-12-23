// mapper.js



/*

// Object Template:

{
    "name": $data.name,
    "children": $map.foreach($data.elements, "{
    
    }"),

    color: $map.if($data.link, "blue", "green");
}


//


Source:
{
    etype: 'root',
    elements: [
        {
            etype: 'section',
            title: 
                {
                    etype: 'title',
                    elements: [
                        {etype: 'text', text: 'English'}
                    ],
        
                },
            elements: [
                ...
            ]
        }
    ]
}

template:
{

    definitions: $foreach({"$where":{"etype":"section","title.elements.text":"English"}, }, tpl_definition),
}


{
    "language": "en",
    "term": "house",
    "entries":
    [
        {
            "pos":"noun",
            "forms":[{term:"house", form:"s"},{form:"pl", term:"houses"}],
            "definitions":
            [
                {
                    "definition":"A building in which people live",
                    "examples":["I live in the house on the corner.", "There are many houses on our street."],
                    "synonyms":["home", "residence", "domicile","abode"],
                    "translations":
                    [
                        {lang: "nl", term: "huis", g: "n"},
                        {lang: "de", term: "Haus", g: "n"},
                        {lang: "es", term: "casa", g: "f"},
                        {lang: "fr", term: "maison", g: "f"}
                    ]
    
                },
                {
                    "definition":""
                }
            ],
            "translationSets":
            [
                {   
                    "definition":"abode",
                    "translations":
                    [
                        {lang: "nl", term: "huis", g: "n"},
                        {lang: "de", term: "Haus", g: "n"},
                        {lang: "es", term: "casa", g: "f"},
                        {lang: "fr", term: "maison", g: "f"}
                    ]
                }
            ]
        },
        {
            "pos":"verb",
            "forms":{"1/3":"houses", "2/3":"housed", "4/3":"housing"},
            "definitions":
            [
                {
                    "definition":"To provide accommodation",
                    "examples":["The school houses ten-thousand students.", "The shelter is housing 20 families."],
                    "synonyms":["accommodate"],
                    "translations":
                    {
                    }
                },
            ]
        }
    ]
},


*/


(function(){
    var $map = {};

    $map.foreach = function(array, json)
    {
        var a;

        if (array)
        {
            a = [];

            if (array.length)
            {
                for (var i = 0; i < array.length)
                {

                    a.push(map($data, array[i], json))
                }
            }
        }

        return a;
    };

    $map.template = function()
    {

    };

    function __evalJSON($data, $parent, $$__json__)
    {
        var fn = "\
            var $data = arguments[0], $parent = arguments[1];\
            return " + $$__json__ + ";\
        ";

        var e = new Function($data, $parent, fn);
        return e();
    }

    function map($parent, $data, json)
    {

    }
})();

