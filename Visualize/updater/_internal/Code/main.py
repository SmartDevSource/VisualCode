#:import utils kivy.utils
#:set orange_color "#DD7835"
#:set dark_grey "#343434"
#:set lime_green "#32CD32"
#:set corail_orange "#ea4258"

MainLayout:

<TitleLabel@Label>:
    canvas.before:
        Color:
            rgba: utils.get_color_from_hex(dark_grey)
        Rectangle:
            size: self.size
            pos: self.pos

<SelectionButton@Button>:
    size_hint: 1, None
    height: "100dp"

<MainLayout>:
    orientation: 'vertical'
    BoxLayout:
        orientation:'horizontal'
        size_hint_y: .2
        spacing: 0.5
        TitleLabel:
            text: "Langages"
        TitleLabel:
            text: "Catégories"
        TitleLabel:
            text: "Contenu"
    BoxLayout:
        orientation:'horizontal'
        size_hint_y: .1
        Button:
            id: add_language
            background_normal: ''
            background_color: utils.get_color_from_hex(lime_green)
            text: "Ajouter"
            on_press: root.add_event("add_language")
        Button:
            id: del_language
            background_normal: ''
            background_color: utils.get_color_from_hex(corail_orange)
            text: "Supprimer"
            on_press: root.add_event("del_language")
        Button:
            id: add_category
            background_normal: ''
            background_color: utils.get_color_from_hex(lime_green)
            text: "Ajouter"
            on_press: root.add_event("add_category")
        Button:
            id: del_category
            background_normal: ''
            background_color: utils.get_color_from_hex(corail_orange)
            text: "Supprimer"
            on_press: root.add_event("del_category")
        Button:
            id: add_content
            background_normal: ''
            background_color: utils.get_color_from_hex(lime_green)
            text: "Ajouter"
            on_press: root.add_event("add_content")
        Button:
            id: del_content
            background_normal: ''
            background_color: utils.get_color_from_hex(corail_orange)
            text: "Supprimer"
            on_press: root.add_event("del_content")
    BoxLayout:
        orientation: 'horizontal'
        spacing: 0.5
        ScrollView:
            size: self.size
            GridLayout:
                spacing: 0.5
                size_hint: 1, None
                height: self.minimum_height
                width: self.minimum_width
                cols: 1
                id: labels_languages
        ScrollView:
            BoxLayout:
                spacing: 0.5
                size_hint: 1, None
                height: self.minimum_height
                orientation: 'vertical'
                id: labels_categories
        ScrollView:
            BoxLayout:
                spacing: 0.5
                size_hint: 1, None
                height: self.minimum_height
                orientation: 'vertical'
                id: labels_contents
    TextInput:
        id: text_input
        hint_text: ""
        size_hint_y: 0.1
        disabled: 'True'
        multiline: False
    Button:
        text: "Mettre à jour"
        background_normal : ''
        background_color: utils.get_color_from_hex(lime_green)
        color: utils.get_color_from_hex(dark_grey)
        font_size: dp(22)
        size_hint_y: 0.2
        disabled: not text_input.text
        on_press: root.update_database()