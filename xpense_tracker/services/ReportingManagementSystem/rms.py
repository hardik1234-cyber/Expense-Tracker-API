from datetime import date
from fastapi import APIRouter,Depends,status,HTTPException,Response
from sqlmodel import Session, select
from database.database_connection import get_session
from database.tables import Expense
from services.authentication.oauth2 import get_current_user
from logs.logging import logger

rms_router = APIRouter(tags=['Reprting Management System'])


@rms_router.get('/get_monthly_expense',status_code=status.HTTP_200_OK)
def get_monthly_expense(username:str,month: int,year: int,get_logged_in_user = Depends(get_current_user),db: Session = Depends(get_session)):

    start_date = date(year=year,month=month,day=1)
    if month == 12:
        end_date = date(year=year+1,month=1,day=1)
    else:
        end_date = date(year=year,month=month+1,day=1)
    
    try:

        expenses = db.exec(
            select(Expense).where(
                Expense.username == username,  
                Expense.date >= start_date,
                Expense.date < end_date
            )
        ).all()
        logger.info("Fetched expenses from DB")
    
    except Exception as e:
        logger.error("Error occurred while querying expenses")
        raise HTTPException(status_code=500, detail="Failed to fetch expenses")

    if not expenses:
        logger.warning("No expenses found for the specified period")
        raise HTTPException(status_code=404, detail="No expenses found for the specified month")
    
    total_expenses = sum(expense.amount for expense in expenses)
    category_breakdown = {}

    for expense in expenses:
        category = expense.category
        category_breakdown[category] = category_breakdown.get(category, 0) + expense.amount
    
    return {
        "month": f"{year}-{month:02}",
        "total_expenses": total_expenses,
        "category_breakdown": category_breakdown
    }
        
@rms_router.get('/get_yearly_expense',status_code=status.HTTP_200_OK)
def get_yearly_expense(username:str,year: int,get_logged_in_user = Depends(get_current_user),db: Session = Depends(get_session)):

    start_date = date(year=year,month=1,day=1)
    
    end_date = date(year=year+1,month=1,day=1)
    
    try: 

        expenses = db.exec(
            select(Expense).where(
                Expense.username == username,  
                Expense.date >= start_date,
                Expense.date < end_date
            )
        ).all()
    
    except Exception as e:
        logger.error("Error occurred while querying expenses")
        raise HTTPException(status_code=500, detail="Failed to fetch expenses")


    if not expenses:
        logger.warning("No expenses found for the specified period")
        raise HTTPException(status_code=404, detail="No expenses found for the specified year")
    
    total_expenses = sum(expense.amount for expense in expenses)
    category_breakdown = {}

    for expense in expenses:
        category = expense.category
        category_breakdown[category] = category_breakdown.get(category, 0) + expense.amount
    
    return {
        "Year": f"{year}",
        "total_expenses": total_expenses,
        "category_breakdown": category_breakdown
    }





    