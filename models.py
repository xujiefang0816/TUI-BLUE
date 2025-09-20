from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

# 初始化SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='user')  # admin, manager, user
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 设置密码
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    # 验证密码
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class FileType(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    files = db.relationship('File', backref='file_type', lazy=True)

class Department(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    files = db.relationship('File', backref='department', lazy=True)

class Unit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    files = db.relationship('File', backref='unit', lazy=True)

class Status(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    files = db.relationship('File', backref='status', lazy=True)

class File(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    file_type_id = db.Column(db.Integer, db.ForeignKey('file_type.id'), nullable=False)
    department_id = db.Column(db.Integer, db.ForeignKey('department.id'), nullable=False)
    applicant = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    unit_id = db.Column(db.Integer, db.ForeignKey('unit.id'), nullable=False)
    quantity = db.Column(db.Float, default=0)
    amount = db.Column(db.Float, default=0)
    file_number = db.Column(db.String(100))
    end_date = db.Column(db.Date)
    status_id = db.Column(db.Integer, db.ForeignKey('status.id'), default=None)
    return_reason = db.Column(db.Text)
    remark = db.Column(db.Text)
    submission_time = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'))
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 获取关联的创建者用户
    created_user = db.relationship('User')

class OperationLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    operation = db.Column(db.String(100), nullable=False)
    details = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 获取关联的用户
    user = db.relationship('User')