import json
from fastapi import APIRouter,Depends,status,HTTPException,Response,Request
from httpx import request
from uuid import uuid4, UUID
from sqlmodel import Session, select
from database.database_connection import get_session
from database.tables import User,Expense
from schemas.ems.ems_model import ExpenseDetails, ExpenseModel, ExpenseUpdateModel
from services.authentication.oauth2 import get_current_user
from logs.logging import logger
from datetime import datetime, timezone


ems_router = APIRouter(tags=['Expense Management System'])

@ems_router.post('/add_expense',status_code=status.HTTP_201_CREATED)
def add_expense(user:ExpenseModel ,get_logged_in_user: User = Depends(get_current_user),db: Session = Depends(get_session)):
    expense = Expense(username=user.username,amount=user.amount,category=user.category,description=user.description,date=datetime.now(timezone.utc))
    
    if get_logged_in_user.username != user.username:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this user's details"
        )
    
    try:
        db.add(expense)
        db.commit()
        logger.debug("Expense added to DB")
    except Exception as e:
        logger.error("Error occurred while adding expense")
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Failed to add expense")
    finally:
        db.refresh(expense)
    return "Expense added"

@ems_router.get('/get_expense',status_code=status.HTTP_200_OK)
def get_expense(username: str,get_logged_in_user: User = Depends(get_current_user),db: Session = Depends(get_session)):

    expenses = db.exec(select(Expense).where(Expense.username == username)).fetchall()

    if get_logged_in_user.username != username:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this user's details"
        )

    if expenses is None:
        logger.error("No expense Found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="expense not found"
        )
    
    expense_details_list = []

    for expense in expenses:
        detail = ExpenseDetails(
            id=expense.id,
            amount=expense.amount,
            category=expense.category,
            description=expense.description,
            date=expense.date
        )
        expense_details_list.append(detail)

    return expense_details_list


@ems_router.get('/get_expense_by_id',status_code=status.HTTP_200_OK)
def get_expense(id: UUID,request:Request,get_logged_in_user: User = Depends(get_current_user),db: Session = Depends(get_session)):

    expense = db.exec(select(Expense).where(Expense.id == id)).one_or_none()


    if expense is None:
        logger.error("No expense Found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="expense not found"
        )
    
    if get_logged_in_user.username != expense.username:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this user's details"
        )

    
    expense= ExpenseDetails(
        id=expense.id,
        amount=expense.amount,
        category=expense.category,
        description=expense.description,
        date=expense.date
    )

    return expense


@ems_router.put('/update_expense',status_code=status.HTTP_202_ACCEPTED)
def update_expense(username: str,expense_model: ExpenseUpdateModel,get_logged_in_user: User = Depends(get_current_user),db: Session = Depends(get_session)):

    expense = db.exec(select(Expense).where(Expense.username == username)).one_or_none()

    if expense is None:
        logger.error("Expense not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )
    
    if get_logged_in_user.username != expense.username:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this user's details"
        )

    if expense_model.amount is not None:
        logger.info("Updated amount")
        expense.amount = expense_model.amount
    if expense_model.description is not None:
        logger.info("Updated description")
        expense.description = expense_model.description
    if expense_model.category is not None:
        logger.info("Updated category")
        expense.category = expense_model.category
    if expense_model.date is not None:
        logger.info("Updated date")
        expense.date = expense_model.date
    try:
        db.add(expense)
        db.commit()
        logger.info("expense updated")
    except Exception as e:
        db.rollback()
        logger.debug("Unable to update expense")
    finally:
        db.refresh(expense)


@ems_router.put('/update_expense_by_id',status_code=status.HTTP_202_ACCEPTED)
def update_expense(id: UUID,expense_model: ExpenseUpdateModel,get_logged_in_user: User = Depends(get_current_user),db: Session = Depends(get_session)):

    expense = db.exec(select(Expense).where(Expense.id == id)).one_or_none()

    if expense is None:
        logger.error("Expense not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )
    
    if get_logged_in_user.username != expense.username:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this user's details"
        )

    if expense_model.amount is not None:
        logger.info("Updated amount")
        expense.amount = expense_model.amount
    if expense_model.description is not None:
        logger.info("Updated description")
        expense.description = expense_model.description
    if expense_model.category is not None:
        logger.info("Updated category")
        expense.category = expense_model.category
    if expense_model.date is not None:
        logger.info("Updated date")
        expense.date = expense_model.date
    try:
        db.add(expense)
        db.commit()
        logger.info("expense updated")
    except Exception as e:
        db.rollback()
        logger.debug("Unable to update expense")
    finally:
        db.refresh(expense)


@ems_router.delete('/delete_expense_by_id',status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(id:UUID,get_logged_in_user: User = Depends(get_current_user),db: Session = Depends(get_session)):

    expense = db.exec(select(Expense).where(Expense.id == id)).one_or_none()

    if expense is None:
        logger.warning("Expense not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )
    
    if get_logged_in_user.username != expense.username:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this user's details"
        )

    
    try:
        db.delete(expense)
        logger.info("Expense deleted")
    except Exception as e:
        logger.debug("error in deleting the expense")
        db.rollback()
    finally:
        db.commit()


@ems_router.delete('/delete_expense',status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(username:str,get_logged_in_user: User = Depends(get_current_user),db: Session = Depends(get_session)):

    expense = db.exec(select(Expense).where(Expense.username == username)).one_or_none()

    if expense is None:
        logger.warning("Expense not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )
    
    if get_logged_in_user.username != expense.username:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this user's details"
        )

    
    try:
        db.delete(expense)
        logger.info("Expense deleted")
    except Exception as e:
        logger.debug("error in deleting the expense")
        db.rollback()
    finally:
        db.commit()


    



