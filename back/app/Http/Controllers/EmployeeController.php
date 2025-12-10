<?php

namespace App\Http\Controllers;
use App\Data\OrderData;
use App\Events\NewOrderNotification;
use Illuminate\Support\Facades\Auth;
use App\Models\Discount;
use App\Models\LogLogins;
use App\Models\LogOders;
use App\Models\Orders;
use App\Models\Product;
use App\Models\ProductColor;
use App\Models\ProductImage;
use App\Models\ProductOrder;
use App\Models\SelledItems;
use App\Models\Size;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Spatie\LaravelIgnition\Http\Requests\UpdateConfigRequest;

class EmployeeController extends Controller
{

    public function Employees(Request $request)
{
    try {
        $user = auth()->user();

        if ($user->role === 'admin') {
            // Get the page number from the query parameter, default to 1 if not provided
            $page = $request->query('page', 1);

            // Calculate the offset based on the page number
            $offset = ($page - 1) * 10;

            // Initialize the base query for employees
            $baseQuery = DB::table('users')
                ->where('role', 'employee')
                ->where('isDeleted', 0);

            if ($request->has('query')) {
                $searchQuery = $request->input('query');

                if (strtolower($searchQuery) === 'all' || strtolower($searchQuery) === 'tout') {
                    $baseQuery = $baseQuery->offset($offset)->limit(10);
                } else {
                    $baseQuery = $baseQuery->where(function ($query) use ($searchQuery) {
                        $query->where('first_name', 'like', '%' . $searchQuery . '%')
                              ->orWhere('last_name', 'like', '%' . $searchQuery . '%');
                    })->offset($offset)->limit(10);
                }
            } else {
                $baseQuery = $baseQuery->offset($offset)->limit(10);
            }

            // Get the total rows for pagination
            $totalRows = $baseQuery->count();

            // Fetch the paginated results
            $employees = $baseQuery->get();

            return response()->json([
                'data' => $employees,
                'total_rows' => $totalRows,
            ]);
        } else {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }
    } catch (Exception $e) {
        return response()->json([
            'message' => 'An error occurred while retrieving data',
            'error' => $e->getMessage(),
        ], 500);
    }
}




    public function Employee(Request $request, $id)
    {
        $user = auth()->user();

        if ($user->role === 'admin' || $user->role === 'employee') {
            $employee = User::where('id', $id)
                ->where('role', 'employee')
                ->where('isDeleted', 0)
                ->first();

            if (!$employee) {
                return response()->json(['error' => 'Employee not found'], 404);
            }

            return response()->json($employee);
        } else {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    }



    public function DeletedEmployees(Request $request)
{
    try {
        $user = auth()->user();

        if ($user->role === 'admin') {
            // Get the page number from the query parameter, default to 1 if not provided
            $page = $request->query('page', 1);

            // Calculate the offset based on the page number
            $offset = ($page - 1) * 10;

            // Initialize the base query for deleted employees
            $baseQuery = DB::table('users')
                ->where('role', 'employee')
                ->where('isDeleted', 1);

            if ($request->has('query')) {
                $searchQuery = $request->input('query');

                if (strtolower($searchQuery) === 'all' || strtolower($searchQuery) === 'tout') {
                    $baseQuery = $baseQuery->offset($offset)->limit(10);
                } else {
                    $baseQuery = $baseQuery->where(function ($query) use ($searchQuery) {
                        $query->where('first_name', 'like', '%' . $searchQuery . '%')
                              ->orWhere('last_name', 'like', '%' . $searchQuery . '%');
                    })->offset($offset)->limit(10);
                }
            } else {
                $baseQuery = $baseQuery->offset($offset)->limit(10);
            }

            // Get the total rows for pagination
            $totalRows = $baseQuery->count();

            // Fetch the paginated results
            $deletedEmployees = $baseQuery->get();

            return response()->json([
                'data' => $deletedEmployees,
                'total_rows' => $totalRows,
            ]);
        } else {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }
    } catch (Exception $e) {
        return response()->json([
            'message' => 'An error occurred while retrieving data',
            'error' => $e->getMessage(),
        ], 500);
    }
}




    public function DeletedEmployee(Request $request, $id)
    {
        $user = auth()->user();

        if ($user->role === 'admin' || $user->role === 'employee') {
            $employee = User::where('id', $id)
                ->where('role', 'employee')
                ->where('isDeleted', 1)
                ->first();

            if (!$employee) {
                return response()->json(['error' => 'Employee not found'], 404);
            }

            return response()->json($employee);
        } else {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    }


    public function createEmployee(Request $request)
    {
        $user = auth()->user();

        if ($user->role !== 'admin') {
            return response()->json([
                'status' => false,
                'message' => 'You are not authorized to perform this action.'
            ], 401);
        }

        try {
            $validatedData = $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:8',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            $errors = $e->validator->errors();
            if ($errors->has('email')) {
                return response()->json([
                    'status' => false,
                    'message' => 'The email address is already in use.'
                ], 422);
            }
            return response()->json([
                'status' => false,
                'message' => $errors->first()
            ], 422);
        }

        $createEmployee = new User;
        $createEmployee->first_name = $validatedData['first_name'];
        $createEmployee->last_name = $validatedData['last_name'];
        $createEmployee->email = $validatedData['email'];
        $createEmployee->password = Hash::make($validatedData['password']);
        $createEmployee->role = 'employee';

        try {
            $createEmployee->save();
            return response()->json([
                'status' => true,
                'message' => 'Data has been saved successfully.',
                'employee' => $createEmployee
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong while saving the data.'
            ], 500);
        }
    }


    public function EmployeesUpdate(Request $request)
    {
        $employee = User::find($request->id);

        if (!$employee) {
            return response()->json([
                'status' => false,
                'message' => 'User not found'
            ], 404);
        }

        // Check if the user has the role of 'employee'
        if ($employee->role !== 'employee') {
            return response()->json([
                'status' => false,
                'message' => 'You can only update employees'
            ], 403);
        }

        $user = auth()->user();

        if ($user->role == 'admin') {
            $validatedData = $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'role' => 'required|string|in:employee,admin' // Adjust as per your role types
            ]);

            $employee->first_name = $validatedData['first_name'];
            $employee->last_name = $validatedData['last_name'];
            $employee->role = $validatedData['role'];
            $employee->save();

            return response()->json([
                'status' => true,
                'message' => 'Data has been saved successfully'
            ], 200);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'You are not authorized to perform this action'
            ], 401);
        }
    }


    public function deleteEmployee($id, Request $request)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User not found'
            ], 404);
        }

        // Check if the user has the role of 'employee'
        if ($user->role !== 'employee') {
            return response()->json([
                'status' => false,
                'message' => 'You can only delete employees'
            ], 403);
        }

        $admin = auth()->user();

        if ($admin->role == 'admin') {
            // Soft delete the user by setting isDeleted flag
            $user->isDeleted = true;
            $user->save();

            if ($user->isDeleted) {
                return response()->json([
                    'status' => true,
                    'message' => 'The employee with ID ' . $id . ' has been marked as deleted'
                ], 200);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Failed to delete the employee with ID ' . $id
                ], 500); // Use appropriate HTTP status code for failure (e.g., 500 for internal server error)
            }
        } else {
            return response()->json([
                'status' => false,
                'message' => 'You are not authorized to perform this action'
            ], 401);
        }
    }

}
