from fastapi import APIRouter,Depends,status,HTTPException,Response
from sqlmodel import Session, select
from database.database_connection import get_session
from database.tables import User,Expense
from schemas.ems.ems_model import ExpenseDetails, ExpenseModel, ExpenseUpdateModel
from services.authentication.oauth2 import get_current_user

ems_router = APIRouter(tags=['Expense Management System'])

@ems_router.post('/add_expense',status_code=status.HTTP_201_CREATED)
def add_expense(user:ExpenseModel ,get_logged_in_user = Depends(get_current_user),db: Session = Depends(get_session)):
    expense = Expense(username=user.username,amount=user.amount,category=user.category,description=user.description,date= user.date)
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return "Expense added"

@ems_router.get('/get_expense',status_code=status.HTTP_200_OK)
def get_expense(username: str,get_logged_in_user = Depends(get_current_user),db: Session = Depends(get_session)):

    expense = db.exec(select(Expense).where(Expense.username == username)).one_or_none()

    if expense is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return ExpenseDetails(amount=expense.amount,category=expense.category,description=expense.description,date=expense.date)
    


@ems_router.put('/update_expense',status_code=status.HTTP_202_ACCEPTED)
def update_expense(username: str,expense_model: ExpenseUpdateModel,get_logged_in_user = Depends(get_current_user),db: Session = Depends(get_session)):

    expense = db.exec(select(Expense).where(Expense.username == username)).one_or_none()

    if expense is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if expense_model.amount is not None:
        expense.amount = expense_model.amount
    if expense_model.description is not None:
        expense.description = expense_model.description
    if expense_model.category is not None:
        expense.category = expense_model.category
    if expense_model.date is not None:
        expense.date = expense_model.date

    db.add(expense)
    db.commit()
    db.refresh(expense)

@ems_router.delete('/delete_expense',status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(username:str,get_logged_in_user = Depends(get_current_user),db: Session = Depends(get_session)):

    expense = db.exec(select(Expense).where(Expense.username == username)).one_or_none()

    if expense is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    db.delete(expense)
    db.commit()


    



