from app import app, db
from models import User, FileType, Department, Unit, Status

def init_db():
    with app.app_context():
        # 创建所有数据库表
        db.create_all()
        
        print('正在初始化数据库...')
        
        # 添加默认文件类型
        default_file_types = [
            '采购计划审批表', '合同（协议）签订审批表', '付款申请单', '用印审批表',
            '付款单+用印审批（仅限验收报告）', '工作联系单', '固定资产验收单',
            '会议议题', '借印审批表', '请假申请表', '差旅申请表', '其他'
        ]
        
        print('添加默认文件类型...')
        for type_name in default_file_types:
            if not FileType.query.filter_by(name=type_name).first():
                db.session.add(FileType(name=type_name))
        
        # 添加默认部门
        default_departments = [
            '前厅FO', '客房HSKP', '西餐厅', '中餐厅', '大堂吧', '宴会厅',
            '迷你吧', '餐饮办公室', '管事部', '饼房', '财务FIN', '行政EO',
            '人事HR', '员工餐厅', '销售S&M', '工程ENG'
        ]
        
        print('添加默认部门...')
        for dept_name in default_departments:
            if not Department.query.filter_by(name=dept_name).first():
                db.session.add(Department(name=dept_name))
        
        # 添加默认计量单位
        default_units = [
            '/', '批', '个（支）', '件', '套', '份', '只', '台', '桶', '次',
            '块', '人', '盒', '瓶', '双', '张', '月', '年', '克（g）',
            '千克（kg）', '箱', '米', '平方米', '包', '袋', '家', 'PCS',
            'PAC', '佣金（%）', '其他'
        ]
        
        print('添加默认计量单位...')
        for unit_name in default_units:
            if not Unit.query.filter_by(name=unit_name).first():
                db.session.add(Unit(name=unit_name))
        
        # 添加默认送签状态
        default_statuses = [
            '完毕', '总秘（酒店总经理）', '待送集团', '业主代表',
            '陆总及彭总（盖章处）', '集团审核', '集团经理待签', '退回',
            '未盖章', '重签', '作废', '资产管理部', '招采办',
            '酒店内部走签', '急单', '已签未付'
        ]
        
        print('添加默认送签状态...')
        for status_name in default_statuses:
            if not Status.query.filter_by(name=status_name).first():
                db.session.add(Status(name=status_name))
        
        # 添加默认用户
        print('添加默认用户...')
        # 总管理员账号 TYL2025，密码 941314aA
        if not User.query.filter_by(username='TYL2025').first():
            admin_user = User(username='TYL2025', role='admin')
            admin_user.set_password('941314aA')
            db.session.add(admin_user)
            print('- 添加总管理员账号: TYL2025')
        
        # 普通管理员账号 8888，密码 8888
        if not User.query.filter_by(username='8888').first():
            manager_user = User(username='8888', role='manager')
            manager_user.set_password('8888')
            db.session.add(manager_user)
            print('- 添加普通管理员账号: 8888')
        
        # 普通账号 1001，密码 1001
        if not User.query.filter_by(username='1001').first():
            normal_user = User(username='1001', role='user')
            normal_user.set_password('1001')
            db.session.add(normal_user)
            print('- 添加普通账号: 1001')
        
        # 保存所有更改
        db.session.commit()
        print('数据库初始化完成！')

if __name__ == '__main__':
    init_db()