from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.button import Button
from kivy.uix.behaviors import FocusBehavior
from kivy.clock import Clock

from kivy.properties import *
from kivy.lang import Builder

from database_manager import DatabaseManager
from vars import *

database_manager = DatabaseManager()
CURRENT_DATA = database_manager.get_all_data() if database_manager.is_connected() else None

def get_data_struct():
    data_struct = {}
    if CURRENT_DATA:
        tmp_keys = []
        for data in CURRENT_DATA:
            if data[0] not in tmp_keys:
                data_struct[data[0]] = {data[1]: [data[2]]}
                tmp_keys.append(data[0])
            else:
                if data[1] not in data_struct[data[0]]:
                    data_struct[data[0]][data[1]] = [data[2]]
                else:
                    data_struct[data[0]][data[1]].append(data[2])
        return data_struct
    else:
        print("Erreur : Aucune data disponible")
        exit()

class MainApp(App):
    def build(self):
        pass

class SelectionButton(FocusBehavior, Button):
    pass

class MainLayout(BoxLayout):
    
    labels_languages = ObjectProperty()
    labels_categories = ObjectProperty()
    labels_contents = ObjectProperty()

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.data_struct = get_data_struct()

    def on_parent(self, widget, parent):
        self.init_languages()

    def init_languages(self):
        for key in self.data_struct:
            language_button = SelectionButton(text=key, background_normal='', background_color=BG_DARK_BLUE)
            language_button.id = key
            language_button.bind(on_press=self.on_selection_press)

            self.ids.labels_languages.add_widget(language_button)

    def show_categories_and_contents(self, type_to_show, language, cat = None):
        for key, values in self.data_struct.items():
            for category, content in values.items():
                match(type_to_show):
                    case 'categories':
                        # CATEGORIES #
                        if key==language and category is not None:
                            category_button = SelectionButton(text=category, background_normal='', background_color=BG_DARK_BLUE)
                            category_button.id = key+'::'+category
                            category_button.bind(on_press=self.on_selection_press)

                            self.ids.labels_categories.add_widget(category_button)
                    case 'contents':
                        # CONTENTS #
                        if key==language and cat == category:
                            for ct in content:
                                if ct is not None:
                                    content_button = SelectionButton(text=ct, background_normal='', background_color=BG_DARK_BLUE)
                                    content_button.id = key+'::'+category+'::'+ct
                                    content_button.bind(on_press=self.on_selection_press)

                                    self.ids.labels_contents.add_widget(content_button)
    
    def on_selection_press(self, instance):
        global CURRENT_PATH
        splitted = instance.id.split('::')
        match(len(splitted)):
            case 1:
                CURRENT_PATH[0] = splitted[0]
                CURRENT_PATH[1] = ''
                CURRENT_PATH[2] = ''

                self.ids.labels_categories.clear_widgets()
                self.ids.labels_contents.clear_widgets()
                for e in self.ids.labels_languages.children:
                    e.background_color = BG_DARK_BLUE
                    e.color = WHITE_COLOR
                instance.background_color = BG_LIGHT_BLUE
                instance.color = GREY_COLOR

                self.show_categories_and_contents("categories", splitted[0])
            case 2:
                CURRENT_PATH[1] = splitted[1]
                CURRENT_PATH[2] = ''

                self.ids.labels_contents.clear_widgets()
                for e in self.ids.labels_categories.children:
                    e.background_color = BG_DARK_BLUE
                    e.color = WHITE_COLOR
                instance.background_color = BG_LIGHT_BLUE
                instance.color = GREY_COLOR

                self.show_categories_and_contents("contents", splitted[0], splitted[1])
            case 3:
                CURRENT_PATH[2] = splitted[2]

                for e in self.ids.labels_contents.children:
                    e.background_color = BG_DARK_BLUE
                    e.color = WHITE_COLOR
                instance.background_color = BG_LIGHT_BLUE
                instance.color = GREY_COLOR

        print(CURRENT_PATH)

    def set_text_input_focus(self, dt):
        self.ids.text_input.focus = True

    def add_event(self, event):
        global CURRENT_EVENT

        CURRENT_EVENT = event

        self.ids.text_input.text = ''
        self.ids.text_input.disabled = False
        Clock.schedule_once(self.set_text_input_focus, 0.1)

        if 'del' in CURRENT_EVENT:
            match(CURRENT_EVENT):
                case 'del_language':
                    if CURRENT_PATH[0] not in LANGUAGES_TO_DEL:
                        LANGUAGES_TO_DEL.append(CURRENT_PATH[0])
                case 'del_category':
                    if CURRENT_PATH[1] not in CATEGORIES_TO_DEL:
                        CATEGORIES_TO_DEL.append(CURRENT_PATH[1])
                case 'del_content':
                    if CURRENT_PATH[2] not in CONTENTS_TO_DEL:
                        CONTENTS_TO_DEL.append(CURRENT_PATH[2])

            database_manager.update_database(CURRENT_EVENT, CURRENT_PATH[0], CURRENT_PATH[1])
            self.refresh()

    def update_database(self):
        global CURRENT_EVENT, CURRENT_DATA, CURRENT_PATH

        if len(self.ids.text_input.text)>0:
            txt = self.ids.text_input.text
            match(CURRENT_EVENT):
                case 'add_language':
                    if txt not in LANGUAGES_TO_ADD:
                        LANGUAGES_TO_ADD.append(txt)
                case 'add_category':
                    if txt not in CATEGORIES_TO_ADD:
                        CATEGORIES_TO_ADD.append(txt)
                case 'add_content':
                    if txt not in CONTENTS_TO_ADD:
                        CONTENTS_TO_ADD.append(txt)

            self.ids.text_input.text = ''
            database_manager.update_database(CURRENT_EVENT, CURRENT_PATH[0], CURRENT_PATH[1])
            self.refresh()

    def refresh(self):
        global CURRENT_DATA

        CURRENT_DATA = database_manager.get_all_data() if database_manager.is_connected() else None

        self.data_struct = get_data_struct()
        self.ids.labels_languages.clear_widgets()
        self.ids.labels_categories.clear_widgets()
        self.ids.labels_contents.clear_widgets()
        self.init_languages()

MainApp().run()