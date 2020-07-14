<?php

namespace App\Http\Controllers;

use App\User; 
use Validator;
use Exception;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; 
use Laravel\Passport\Client as OClient; 

class UserController extends Controller
{
    public $successStatus = 200;

    public function index()
    {
        return response()->json([
            'users' => User::all()
        ]);
    }

    public function edit(User $user)
    {
        return response()->json([
            'user' => $user
        ]);
    }

    public function update(User $user, Request $request)
    {
        $validator = Validator::make($request->all(), [ 
            'name' => 'required', 
            'email' => 'required|email|unique:users',
            'mobile' => 'required', 
        ]);

        $user->update([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'mobile' => $request->input('mobile'),
        ]);

        if ($request->input('password')) {
            if ($request->input('password') === $request->input('c_password')) {
                $user->update([
                    'password' => bcrypt($request->input('password'))
                ]);
            }
        }
    }

    public function login()
    { 
        if (Auth::attempt(['email' => request('email'), 'password' => request('password')])) { 
            $oClient = OClient::where('password_client', 1)->first();
            // return $this->getTokenAndRefreshToken($oClient, request('email'), request('password'));
            $user = Auth::user();
            return response()->json([
                'user' => $user,
                'auth' => $user->createToken('user'),
            ]);
        } 
        else { 
            return response()->json(['error'=>'Unauthorised'], 401); 
        } 
    }

    public function register(Request $request)
    { 
        $validator = Validator::make($request->all(), [ 
            'name' => 'required', 
            'email' => 'required|email|unique:users',
            'mobile' => 'required',
            'password' => 'required', 
            'c_password' => 'required|same:password', 
        ]);

        $password = $request->password;
        $input = $request->all(); 
        $input['password'] = bcrypt($input['password']); 
        $user = User::create($input); 
        $oClient = OClient::where('password_client', 1)->first();
        // return $this->getTokenAndRefreshToken($oClient, $user->email, $password);
        return response()->json([
            'user' => $user,
            'auth' => $user->createToken('user'),
        ]);
    }

    public function details()
    { 
        $user = Auth::user(); 
        return response()->json($user, $this->successStatus); 
    } 

    public function logout(Request $request) {
        $request->user()->token()->revoke();
        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }

    public function unauthorized() { 
        return response()->json("unauthorized", 401); 
    }

    public function getTokenAndRefreshToken(OClient $oClient, $email, $password) { 
        // $oClient = OClient::where('password_client', 1)->first();
        $http = new Client;
        $response = $http->request('POST', 'http://127.0.0.1:8000/oauth/token', [
            'form_params' => [
                'grant_type' => 'password',
                'client_id' => $oClient->id,
                'client_secret' => $oClient->secret,
                'username' => $email,
                'password' => $password,
                'scope' => '*',
            ],
        ]);

        $result = json_decode((string) $response->getBody(), true);
        return response()->json($result, $this->successStatus);
    }

    public function destroy(User $user)
    {
        $user->delete();
    }
}