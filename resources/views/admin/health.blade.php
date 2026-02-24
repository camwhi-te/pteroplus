@extends('layouts.admin')

@section('title')
    Health
@endsection

@section('content-header')
    <h1>System Health<small>A collection of data to indicate system health.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">Health</li>
    </ol>
@endsection

@section('content')
<div class="row">
    <div class="col-xs-12">
        <div class="box box-primary">
            <div class="box-header with-border">
                <h3 class="box-title">Resource Utilisation</h3>
            </div>
            <div class="box-body">
                <div class="row">
                    <div class="col-xs-6 col-sm-3">
                        <div class="info-box @if($data['cpu'] > 80) bg-red @else bg-blue @endif">
                            <span class="info-box-icon"><i class="fa fa-microchip"></i></span>
                            <div class="info-box-content" style="padding: 23px 10px 0;">
                                <span class="info-box-text">CPU Usage (%)</span>
                                <span class="info-box-number">{{ $data['cpu'] }}%</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-6 col-sm-3">
                        <div class="info-box @if($data['disk'] > 80) bg-red @else bg-blue @endif">
                            <span class="info-box-icon"><i class="fa fa-folder"></i></span>
                            <div class="info-box-content" style="padding: 23px 10px 0;">
                                <span class="info-box-text">Storage Usage (%)</span>
                                <span class="info-box-number">{{ $data['disk'] }}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-xs-12">
        <div class="box box-primary">
            <div class="box-header with-border">
                <h3 class="box-title">Health Metrics</h3>
            </div>
            <div class="box-body">
                <div class="row">
                    <div class="col-xs-6 col-sm-3">
                        <div class="info-box @if($data['database']) bg-green @else bg-red @endif">
                            <span class="info-box-icon"><i class="fa fa-database"></i></span>
                            <div class="info-box-content" style="padding: 23px 10px 0;">
                                <span class="info-box-text">Database Availability</span>
                                <span class="info-box-number">{{ $data['database'] ? 'Online' : 'Offline' }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-6 col-sm-3">
                        <div class="info-box @if($data['optimized']) bg-green @else bg-red @endif">
                            <span class="info-box-icon"><i class="fa fa-bolt"></i></span>
                            <div class="info-box-content" style="padding: 23px 10px 0;">
                                <span class="info-box-text">Optimization State</span>
                                <span class="info-box-number">{{ $data['optimized'] ? 'Full Performance' : 'Requires Optimization' }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-6 col-sm-3">
                        <div class="info-box @if($data['is_production']) bg-green @else bg-red @endif">
                            <span class="info-box-icon"><i class="fa fa-shield"></i></span>
                            <div class="info-box-content" style="padding: 23px 10px 0;">
                                <span class="info-box-text">App Environment</span>
                                <span class="info-box-number">{{ $data['is_production'] ? 'Production (secure)' : 'Local (insecure)' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-xs-12">
        <div class="box box-primary">
            <div class="box-header with-border">
                <h3 class="box-title">Security Information</h3>
            </div>
            <div class="box-body">
                <div class="row">
                    <div class="col-xs-6 col-sm-3">
                        <div class="info-box @if($data['recaptcha']) bg-green @else bg-yellow @endif">
                            <span class="info-box-icon"><i class="fa fa-lock"></i></span>
                            <div class="info-box-content" style="padding: 23px 10px 0;">
                                <span class="info-box-text">Recaptcha Security</span>
                                <span class="info-box-number">{{ $data['recaptcha'] ? 'Active' : 'Inactive' }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-6 col-sm-3">
                        <div class="info-box @if($data['is_updated']) bg-green @else bg-yellow @endif">
                            <span class="info-box-icon"><i class="fa fa-cloud-upload"></i></span>
                            <div class="info-box-content" style="padding: 23px 10px 0;">
                                <span class="info-box-text">Software Version</span>
                                <span class="info-box-number">{{ $data['is_updated'] ? 'Latest' : 'Requires Update' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
