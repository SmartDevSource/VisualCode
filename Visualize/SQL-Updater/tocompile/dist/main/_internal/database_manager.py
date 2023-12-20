import mysql.connector
from vars import *

class DatabaseManager():  
    HOST = "db4free.net"
    USER = "testpython123"
    PASSWORD = "Sqlsql123"
    DATABASE = "testpython123"
    PORT = 3306

    TABLE_NAME = "visualize"

    connection = None

    def __init__(self):
        state, connection = self.etablish_connection()
        if state:
            print(f"Connexion établie avec {self.DATABASE}")
            self.connection = connection
        else:
            print(f"Echec de connexion à l'hôte {self.DATABASE}")
    
    def etablish_connection(self):
        try:
            connection = mysql.connector.connect(
                host = self.HOST,
                user = self.USER,
                password = self.PASSWORD,
                database = self.DATABASE,
                port = self.PORT
            )
        except mysql.connector.errors.DatabaseError as err:
            return False, None
        
        return True, connection
    
    def is_connected(self):
        return self.connection != None
    
    def get_data_from(self, data_type, query_type):
        cursor = self.connection.cursor()
        query = f"SELECT * FROM {self.TABLE_NAME} where {data_type} = '{query_type}'"
        cursor.execute(query)
        rows = cursor.fetchall()
        return rows
    
    def get_all_data(self):
        cursor = self.connection.cursor()
        query = f"SELECT * FROM {self.TABLE_NAME}"
        cursor.execute(query)
        data = cursor.fetchall()
        return data
    
    def update_database(self, current_event, current_language, current_category, data):
        cursor = self.connection.cursor()

        query = ''
        data_to_push = ''

        match(current_event):
            # ADD #
            case 'add_language':
                query = "INSERT INTO visualize (language) VALUES (%s)"
                data_to_push = (data,)
                cursor.execute(query, data_to_push)
                self.connection.commit()
                cursor.close()

            case 'add_category':
                query = "INSERT INTO visualize (language, category) VALUES (%s, %s)"
                data_to_push = (current_language, data,)
                print("data to push", data_to_push)
                cursor.execute(query, data_to_push)
                self.connection.commit()
                cursor.close()

            case 'add_content':
                query = "INSERT INTO visualize (language, category, content) VALUES (%s, %s, %s)"
                data_to_push = (current_language, current_category, data,)
                cursor.execute(query, data_to_push)
                self.connection.commit()
                cursor.close()

            # DEL #
            case 'del_language':
                query = "DELETE FROM visualize WHERE language = %s"
                data_to_delete = (data,)
                cursor.execute(query, data_to_delete)
                self.connection.commit()
                cursor.close()

            case 'del_category':
                query = "DELETE FROM visualize WHERE language = %s AND category = %s"
                data_to_delete = (current_language, data,)
                cursor.execute(query, data_to_delete)
                self.connection.commit()
                cursor.close()

            case 'del_content':
                query = "DELETE FROM visualize WHERE language = %s AND category = %s AND content = %s"
                data_to_delete = (current_language, current_category, data)
                cursor.execute(query, data_to_delete)
                self.connection.commit()
                cursor.close()
